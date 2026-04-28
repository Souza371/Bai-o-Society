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
    const { quadra_id, data, hora_inicio, hora_fim, observacoes, usuario_id, metodo_pagamento } = dados;
    const metodosValidos = ['dinheiro', 'cartao', 'pix', 'boleto'];
    if (metodo_pagamento && !metodosValidos.includes(metodo_pagamento)) {
      throw {
        status: 400,
        message: 'Método de pagamento inválido',
        code: 'METODO_PAGAMENTO_INVALIDO'
      };
    }


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
      metodo: metodo_pagamento || 'dinheiro',
      status: 'pendente'
    });

    return reserva;
  }

  /**
   * Listar reservas com filtros
   */
  async listar(filtros, Reserva, Usuario, Quadra, Pagamento) {
    const where = {};

    const include = [];
    if (Usuario) include.push({ model: Usuario, attributes: ['id', 'nome', 'email'] });
    if (Quadra) include.push({ model: Quadra, attributes: ['id', 'nome'] });
    if (Pagamento) include.push({ model: Pagamento, attributes: ['id', 'valor', 'metodo', 'status', 'data_pagamento'] });

    if (filtros.quadra_id) where.quadra_id = filtros.quadra_id;
    if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
    if (filtros.data) where.data = filtros.data;
    if (filtros.status) where.status = filtros.status;

    const reservas = await Reserva.findAll({
      where,
      include,
      order: [['data', 'DESC']]
    });

    return reservas;
  }

  /**
   * Buscar reserva por ID
   */
  async buscarPorId(id, Reserva, Usuario, Quadra, Pagamento) {
    const include = [];
    if (Usuario) include.push({ model: Usuario, attributes: ['id', 'nome', 'email'] });
    if (Quadra) include.push({ model: Quadra, attributes: ['id', 'nome'] });
    if (Pagamento) include.push({ model: Pagamento, attributes: ['id', 'valor', 'metodo', 'status', 'data_pagamento'] });

    const reserva = await Reserva.findByPk(id, {
      include
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
  async atualizar(id, dados, sequelize, Reserva, Quadra, Pagamento) {
    const { data, hora_inicio, hora_fim, observacoes, metodo_pagamento } = dados;

    const reserva = await this.buscarPorId(id, Reserva, null, null, Pagamento);

    if (reserva.status === 'cancelada') {
      throw {
        status: 400,
        message: 'Não é possível editar uma reserva cancelada',
        code: 'RESERVA_CANCELADA'
      };
    }

    const metodosValidos = ['dinheiro', 'cartao', 'pix', 'boleto'];
    if (metodo_pagamento && !metodosValidos.includes(metodo_pagamento)) {
      throw {
        status: 400,
        message: 'Método de pagamento inválido',
        code: 'METODO_PAGAMENTO_INVALIDO'
      };
    }

    if (hora_inicio && !validacaoHorarios.isValidHorario(hora_inicio)) {
      throw {
        status: 400,
        message: 'Formato de horário inválido para hora de início (use HH:MM)',
        code: 'HORARIO_INVALIDO'
      };
    }

    if (hora_fim && !validacaoHorarios.isValidHorario(hora_fim)) {
      throw {
        status: 400,
        message: 'Formato de horário inválido para hora de fim (use HH:MM)',
        code: 'HORARIO_INVALIDO'
      };
    }

    // Se editando horário, validar conflito
    if (data || hora_inicio || hora_fim) {
      const dataFinal = data || reserva.data;
      const horaInicialFinal = hora_inicio || reserva.hora_inicio;
      const horaFinalFinal = hora_fim || reserva.hora_fim;

      if (!validacaoHorarios.horarioValido(horaInicialFinal, horaFinalFinal)) {
        throw {
          status: 400,
          message: 'Hora de fim deve ser maior que hora de início',
          code: 'HORARIO_INVALIDO'
        };
      }

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

    const dadosAtualizacao = {};
    if (data) dadosAtualizacao.data = data;
    if (hora_inicio) dadosAtualizacao.hora_inicio = hora_inicio;
    if (hora_fim) dadosAtualizacao.hora_fim = hora_fim;
    if (observacoes !== undefined) dadosAtualizacao.observacoes = observacoes;

    const reservaAtualizada = await reserva.update(dadosAtualizacao);

    const pagamento = await Pagamento.findOne({ where: { reserva_id: id } });
    if (pagamento) {
      if (metodo_pagamento) {
        pagamento.metodo = metodo_pagamento;
      }

      if (data || hora_inicio || hora_fim) {
        const quadra = await Quadra.findByPk(reserva.quadra_id);
        if (quadra) {
          pagamento.valor = this.calcularValorReserva(
            reservaAtualizada.hora_inicio,
            reservaAtualizada.hora_fim,
            quadra.preco_hora
          );
        }
      }

      await pagamento.save();
    }

    return this.buscarPorId(id, Reserva, null, null, Pagamento);
  }

  /**
   * Cancelar reserva
   */
  async cancelar(id, Reserva, Pagamento) {
    const reserva = await this.buscarPorId(id, Reserva);
    reserva.status = 'cancelada';
    await reserva.save();

    if (Pagamento) {
      const pagamento = await Pagamento.findOne({ where: { reserva_id: id } });
      if (pagamento && pagamento.status === 'pendente') {
        pagamento.status = 'cancelado';
        await pagamento.save();
      }
    }

    return reserva;
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

  /**
   * Buscar disponibilidades de um calendário
   */
  async buscarDisponibilidades(mes, ano, Reserva) {
    const { gerarIntervalosHorarios, HORARIOS_FUNCIONAMENTO, getNomeDia } = require('../config/horarios');
    
    const diasDoMes = [];
    const ultimoDia = new Date(ano, mes, 0).getDate();

    // Para cada dia do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const dataFormatada = data.toISOString().split('T')[0];
      const diaSemanaPrimeiro = data.getDay();
      const config = HORARIOS_FUNCIONAMENTO[diaSemanaPrimeiro];

      // Se não está aberto, marcar como fechado
      if (!config.aberto) {
        diasDoMes.push({
          data: dataFormatada,
          dia,
          nomeDia: config.nome,
          aberto: false,
          horarios: [],
          reservadas: []
        });
        continue;
      }

      // Gerar intervalos de horário disponível
      const horarios = gerarIntervalosHorarios(diaSemanaPrimeiro);

      // Buscar reservas do dia
      const reservas = await Reserva.findAll({
        where: {
          data: dataFormatada
        },
        attributes: ['hora_inicio', 'hora_fim', 'quadra_id'],
        raw: true
      });

      // Marcar horários como reservados
      const horariosComStatus = horarios.map(hora => {
        const [h] = hora.split(':').map(Number);
        const estaReservado = reservas.some(r => {
          const [hInicio] = r.hora_inicio.split(':').map(Number);
          const [hFim] = r.hora_fim.split(':').map(Number);
          return h >= hInicio && h < hFim;
        });

        return {
          hora,
          disponivel: !estaReservado,
          reservadas: reservas.filter(r => {
            const [hInicio] = r.hora_inicio.split(':').map(Number);
            const [hFim] = r.hora_fim.split(':').map(Number);
            return h >= hInicio && h < hFim;
          })
        };
      });

      diasDoMes.push({
        data: dataFormatada,
        dia,
        nomeDia: getNomeDia(dataFormatada),
        aberto: true,
        horarios: horariosComStatus,
        reservadas: reservas
      });
    }

    return diasDoMes;
  }
}

module.exports = new ReservaService();
