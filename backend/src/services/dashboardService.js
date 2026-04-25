/**
 * Service: Dashboard
 * Métricas e relatórios do sistema
 */

const { Op } = require('sequelize');

class DashboardService {
  /**
   * Faturamento total do mês
   */
  async faturamentoMes(mes, ano, Pagamento) {
    const data_inicio = new Date(ano, mes - 1, 1);
    const data_fim = new Date(ano, mes, 0);

    const resultado = await Pagamento.findAll({
      attributes: [
        [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'total']
      ],
      where: {
        status: 'pago',
        data_pagamento: {
          [Op.between]: [data_inicio, data_fim]
        }
      },
      raw: true
    });

    return {
      total: resultado[0]?.total || 0,
      mes,
      ano,
      periodo: `${String(mes).padStart(2, '0')}/${ano}`
    };
  }

  /**
   * Ocupação média das quadras (em%)
   */
  async ocupacaoQuadras(Reserva, Quadra) {
    try {
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      // Total de slots possíveis (6h~22h = 16 horas * 30 dias)
      const horasFuncionamento = 16;
      const diasMes = 30;
      const slotsTotal = horasFuncionamento * diasMes;

      // Contar reservas confirmadas
      const resultado = await Reserva.findAll({
        attributes: [
          'quadra_id',
          [Reserva.sequelize.fn('COUNT', Reserva.sequelize.col('id')), 'total_reservas']
        ],
        where: {
          status: 'confirmada',
          data: {
            [Op.between]: [primeiroDia, ultimoDia]
          }
        },
        include: [
          { model: Quadra, attributes: ['nome'] }
        ],
        group: ['quadra_id', 'Quadra.id'],
        raw: false,
        subQuery: false
      });

      return resultado.map(r => ({
        quadra: r.Quadra?.nome || 'Sem nome',
        reservas: parseInt(r.get('total_reservas')) || 0,
        ocupacao_percentual: Math.round(
          (parseInt(r.get('total_reservas')) / slotsTotal) * 100
        )
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao calcular ocupação',
        code: 'ERRO_OCUPACAO'
      };
    }
  }

  /**
   * Horários mais alugados
   */
  async horariosMaisAlugados(limite = 5, Reserva) {
    try {
      const resultado = await Reserva.findAll({
        attributes: [
          'hora_inicio',
          [Reserva.sequelize.fn('COUNT', Reserva.sequelize.col('id')), 'total']
        ],
        where: {
          status: 'confirmada'
        },
        group: ['hora_inicio'],
        order: [
          [Reserva.sequelize.fn('COUNT', Reserva.sequelize.col('id')), 'DESC']
        ],
        limit: limite,
        raw: true
      });

      return resultado.map(r => ({
        hora: r.hora_inicio,
        total_reservas: parseInt(r.total) || 0
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao buscar horários populares',
        code: 'ERRO_HORARIOS'
      };
    }
  }

  /**
   * Métodos de pagamento mais utilizados
   */
  async metodosPagamento(Pagamento) {
    try {
      const resultado = await Pagamento.findAll({
        attributes: [
          'metodo_pagamento',
          [Pagamento.sequelize.fn('COUNT', Pagamento.sequelize.col('id')), 'total'],
          [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'valor_total']
        ],
        where: {
          status: 'pago'
        },
        group: ['metodo_pagamento'],
        order: [
          [Pagamento.sequelize.fn('COUNT', Pagamento.sequelize.col('id')), 'DESC']
        ],
        raw: true
      });

      return resultado.map(r => ({
        metodo: r.metodo_pagamento || 'Desconhecido',
        total_transacoes: parseInt(r.total) || 0,
        valor_total: parseFloat(r.valor_total) || 0
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao buscar métodos de pagamento',
        code: 'ERRO_METODOS'
      };
    }
  }

  /**
   * Estatísticas gerais do sistema
   */
  async estatisticasGerais(Usuario, Quadra, Reserva, Pagamento) {
    try {
      const [countUsuarios, countQuadras, countReservas, countPagamentos] = await Promise.all([
        Usuario.count(),
        Quadra.count(),
        Reserva.count({ where: { status: 'confirmada' } }),
        Pagamento.count({ where: { status: 'pago' } })
      ]);

      const resultadoPagamentos = await Pagamento.findAll({
        attributes: [
          [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'total']
        ],
        where: { status: 'pago' },
        raw: true
      });

      return {
        usuarios_totais: countUsuarios,
        quadras_totais: countQuadras,
        reservas_confirmadas: countReservas,
        pagamentos_realizados: countPagamentos,
        faturamento_total: parseFloat(resultadoPagamentos[0]?.total) || 0
      };
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao calcular estatísticas',
        code: 'ERRO_STATS'
      };
    }
  }
}

module.exports = new DashboardService();
