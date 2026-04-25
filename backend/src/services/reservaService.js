const validacaoHorarios = require('./validacaoHorarios');
const { Op } = require('sequelize');

/**
 * Service: Reservas
 * Lógica de negócio de reservas
 */

class ReservaService {
  /**
   * Criar nova reserva
   */
  async criar(dados, sequelize, Reserva, Quadra, Pagamento, Usuario) {
    const { quadra_id, data, hora_inicio, hora_fim, observacoes, usuario_id } = dados;

    // Validações
    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      throw {
        status: 400,
        message: 'Quadra, data, hora início e fim são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Validar horário
    if (!validacaoHorarios.isValidHorario(hora_inicio) || !validacaoHorarios.isValidHorario(hora_fim)) {
      throw {
        status: 400,
        message: 'Formato de horário inválido (use HH:MM)',
        code: 'HORARIO_INVALIDO'
      };
    }

    // Validar ordem dos horários
    if (!validacaoHorarios.horarioValido(hora_inicio, hora_fim)) {
      throw {
        status: 400,
        message: 'Hora de fim deve ser maior que hora de início',
        code: 'HORARIO_INVALIDO'
      };
    }

    // Verificar se quadra existe
    const quadra = await Quadra.findByPk(quadra_id);
    if (!quadra || !quadra.ativa) {
      throw {
        status: 404,
        message: 'Quadra não encontrada ou inativa',
        code: 'QUADRA_NAO_ENCONTRADA'
      };
    }

    // VALIDAÇÃO CRÍTICA: Verificar conflito de horário
    const conflito = await validacaoHorarios.verificarConflito(
      sequelize,
      Reserva,
      quadra_id,
      data,
      hora_inicio,
      hora_fim
    );

    if (conflito.temConflito) {
      throw {
        status: 409,
        message: conflito.mensagem,
        code: 'CONFLITO_HORARIO'
      };
    }

    // Criar reserva
    const reserva = await Reserva.create({
      quadra_id,
      usuario_id,
      data,
      hora_inicio,
      hora_fim,
      observacoes,
      status: 'pendente'
    });

    // Calcular valor
    const valor = this.calcularValorReserva(hora_inicio, hora_fim, quadra.preco_hora);

    // Criar pagamento pendente associado
    await Pagamento.create({
      reserva_id: reserva.id,
      usuario_id,
      valor,
      status: 'pendente'
    });

    return reserva;
  }

  /**
   * Listar reservas com filtros
   */
  async listar(filtros, Reserva, Usuario, Quadra) {
    const where = {};

    if (filtros.quadra_id) where.quadra_id = filtros.quadra_id;
    if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
    if (filtros.data) where.data = filtros.data;
    if (filtros.status) where.status = filtros.status;

    const reservas = await Reserva.findAll({
      where,
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'] },
        { model: Quadra, attributes: ['id', 'nome'] }
      ],
      order: [['data', 'DESC']]
    });

    return reservas;
  }

  /**
   * Buscar reserva por ID
   */
  async buscarPorId(id, Reserva, Usuario, Quadra) {
    const reserva = await Reserva.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'] },
        { model: Quadra, attributes: ['id', 'nome'] }
      ]
    });

    if (!reserva) {
      throw {
        status: 404,
        message: 'Reserva não encontrada',
        code: 'RESERVA_NAO_ENCONTRADA'
      };
    }

    return reserva;
  }

  /**
   * Atualizar reserva
   */
  async atualizar(id, dados, sequelize, Reserva, Quadra) {
    const { data, hora_inicio, hora_fim } = dados;

    const reserva = await this.buscarPorId(id, Reserva);

    // Se editando horário, validar conflito
    if (data || hora_inicio || hora_fim) {
      const dataFinal = data || reserva.data;
      const horaInicialFinal = hora_inicio || reserva.hora_inicio;
      const horaFinalFinal = hora_fim || reserva.hora_fim;

      const conflito = await validacaoHorarios.verificarConflito(
        sequelize,
        Reserva,
        reserva.quadra_id,
        dataFinal,
        horaInicialFinal,
        horaFinalFinal,
        id // Excluir desta reserva da validação
      );

      if (conflito.temConflito) {
        throw {
          status: 409,
          message: conflito.mensagem,
          code: 'CONFLITO_HORARIO'
        };
      }
    }

    return reserva.update(dados);
  }

  /**
   * Cancelar reserva
   */
  async cancelar(id, Reserva) {
    const reserva = await this.buscarPorId(id, Reserva);
    reserva.status = 'cancelada';
    return reserva.save();
  }

  /**
   * Confirmar reserva
   */
  async confirmar(id, Reserva) {
    const reserva = await this.buscarPorId(id, Reserva);
    reserva.status = 'confirmada';
    return reserva.save();
  }

  /**
   * Calcular valor da reserva baseado no tempo
   */
  calcularValorReserva(hora_inicio, hora_fim, preco_hora) {
    const inicio = validacaoHorarios.horarioParaMinutos(hora_inicio);
    const fim = validacaoHorarios.horarioParaMinutos(hora_fim);
    const minutos = fim - inicio;
    const horas = minutos / 60;
    return parseFloat((horas * preco_hora).toFixed(2));
  }
}

module.exports = new ReservaService();
