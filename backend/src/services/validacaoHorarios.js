const { Op } = require('sequelize');

/**
 * Service: Validação de Horários
 * CRÍTICO - Evita reservas conflitantes
 * Este é o coração do sistema!
 */

class ValidacaoHorarios {
  /**
   * Verifica se existe conflito de horário
   * Retorna true se há conflito, false se está livre
   * 
   * Regra: Não permitir se houver sobreposição
   * ├─ Reserva A: 14:00 - 15:00
   * ├─ Tenta reservar B: 14:30 - 15:30
   * └─ CONFLITO! (sobrepõe)
   */
  async verificarConflito(sequelize, Reserva, quadra_id, data, hora_inicio, hora_fim, reserva_id_exclusao) {
    try {
      // Buscar reservas ativas (não canceladas) naquela quadra e data
      const where = {
        quadra_id,
        data,
        status: { [Op.ne]: 'cancelada' }
      };

      // Se atualizando reserva, excluir a atual
      if (reserva_id_exclusao) {
        where.id = { [Op.ne]: reserva_id_exclusao };
      }

      const reservasConflitantes = await Reserva.findAll({ where });

      // Verificar se nova reserva sobrepõe alguma existente
      for (const reserva of reservasConflitantes) {
        const novaInicia = this.horarioParaMinutos(hora_inicio);
        const novaTermina = this.horarioParaMinutos(hora_fim);
        const existentInicia = this.horarioParaMinutos(reserva.hora_inicio);
        const existentTermina = this.horarioParaMinutos(reserva.hora_fim);

        // Se houver sobreposição, retornar conflito
        if (this.temSobreposicao(novaInicia, novaTermina, existentInicia, existentTermina)) {
          return {
            temConflito: true,
            mensagem: `Horário já reservado nesta quadra entre ${reserva.hora_inicio} e ${reserva.hora_fim}`,
            reservaConflitante: reserva
          };
        }
      }

      return { temConflito: false };
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao validar horário',
        code: 'ERRO_VALIDACAO'
      };
    }
  }

  /**
   * Converte horário (HH:MM) para minutos desde meia-noite
   * Ex: "14:30" => 870 minutos
   */
  horarioParaMinutos(horario) {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 60 + minutos;
  }

  /**
   * Verifica se dois períodos de tempo têm sobreposição
   * Período 1: inicio1 a fim1
   * Período 2: inicio2 a fim2
   */
  temSobreposicao(inicio1, fim1, inicio2, fim2) {
    // Sobrepõe se:
    // - inicio1 é antes de fim2 E
    // - fim1 é depois de inicio2
    return inicio1 < fim2 && fim1 > inicio2;
  }

  /**
   * Valida formato do horário
   */
  isValidHorario(horario) {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(horario);
  }

  /**
   * Valida se hora_fim > hora_inicio
   */
  horarioValido(hora_inicio, hora_fim) {
    const inicio = this.horarioParaMinutos(hora_inicio);
    const fim = this.horarioParaMinutos(hora_fim);
    return fim > inicio;
  }

  /**
   * Retorna horários disponíveis de uma quadra em um dia
   * Para exibir no calendário
   */
  async getHorarioLivres(sequelize, Reserva, quadra_id, data, horaAbertura = 8, horaFechamento = 23) {
    try {
      // Buscar todas as reservas do dia (ativas)
      const reservas = await Reserva.findAll({
        where: {
          quadra_id,
          data,
          status: { [Op.ne]: 'cancelada' }
        }
      });

      const horarios = [];

      // Iterar sobre cada hora do dia
      for (let hora = horaAbertura; hora < horaFechamento; hora++) {
        const hora_inicio = `${String(hora).padStart(2, '0')}:00`;
        const hora_fim = `${String(hora + 1).padStart(2, '0')}:00`;

        // Verificar se está livre
        const ocupado = reservas.some(r => {
          const novaInicia = this.horarioParaMinutos(hora_inicio);
          const novaTermina = this.horarioParaMinutos(hora_fim);
          const existentInicia = this.horarioParaMinutos(r.hora_inicio);
          const existentTermina = this.horarioParaMinutos(r.hora_fim);

          return this.temSobreposicao(novaInicia, novaTermina, existentInicia, existentTermina);
        });

        horarios.push({
          hora_inicio,
          hora_fim,
          disponivel: !ocupado,
          reservado_por: !ocupado ? null : this.getReservadoPor(reservas, hora_inicio, hora_fim)
        });
      }

      return horarios;
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao buscar horários',
        code: 'ERRO_HORARIOS'
      };
    }
  }

  /**
   * Retorna por quem está reservado
   */
  getReservadoPor(reservas, hora_inicio, hora_fim) {
    const novaInicia = this.horarioParaMinutos(hora_inicio);
    const novaTermina = this.horarioParaMinutos(hora_fim);

    for (const reserva of reservas) {
      const existentInicia = this.horarioParaMinutos(reserva.hora_inicio);
      const existentTermina = this.horarioParaMinutos(reserva.hora_fim);

      if (this.temSobreposicao(novaInicia, novaTermina, existentInicia, existentTermina)) {
        return reserva.usuario_id || 'Desconhecido';
      }
    }
    return null;
  }
}

module.exports = new ValidacaoHorarios();
