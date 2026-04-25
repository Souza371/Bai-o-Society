const { Op } = require('sequelize');

/**
 * Service: Pagamentos
 * Lógica de controle financeiro
 */

class PagamentoService {
  /**
   * Listar pagamentos com filtros
   */
  async listar(filtros, Pagamento, Usuario, Reserva) {
    try {
      const where = {};

      if (filtros.status) where.status = filtros.status;
      if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
      if (filtros.metodo) where.metodo = filtros.metodo;

      // Filtro por data range
      if (filtros.data_inicio && filtros.data_fim) {
        where.data_pagamento = {
          [Op.between]: [filtros.data_inicio, filtros.data_fim]
        };
      }

      const pagamentos = await Pagamento.findAll({
        where,
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'] },
          { model: Reserva, attributes: ['id', 'quadra_id', 'data'] }
        ],
        order: [['data_pagamento', 'DESC']]
      });

      return pagamentos;
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao listar pagamentos',
        code: 'ERRO_LISTAGEM'
      };
    }
  }

  /**
   * Buscar pagamento por ID
   */
  async buscarPorId(id, Pagamento, Usuario, Reserva) {
    const pagamento = await Pagamento.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'] },
        { model: Reserva, attributes: ['id', 'quadra_id', 'data'] }
      ]
    });

    if (!pagamento) {
      throw {
        status: 404,
        message: 'Pagamento não encontrado',
        code: 'PAGAMENTO_NAO_ENCONTRADO'
      };
    }

    return pagamento;
  }

  /**
   * Registrar pagamento (criar ou atualizar)
   */
  async registrar(dados, Pagamento, Reserva) {
    const { reserva_id, valor, metodo, data_pagamento } = dados;

    if (!reserva_id || !valor || !metodo) {
      throw {
        status: 400,
        message: 'Reserva, valor e método são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    if (valor <= 0) {
      throw {
        status: 400,
        message: 'Valor deve ser maior que zero',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Verificar se reserva existe
    const reserva = await Reserva.findByPk(reserva_id);
    if (!reserva) {
      throw {
        status: 404,
        message: 'Reserva não encontrada',
        code: 'RESERVA_NAO_ENCONTRADA'
      };
    }

    // Buscar pagamento existente
    const pagamentoExistente = await Pagamento.findOne({
      where: { reserva_id }
    });

    if (pagamentoExistente) {
      // Atualizar pagamento existente
      pagamentoExistente.metodo = metodo;
      pagamentoExistente.valor = valor;
      if (data_pagamento) pagamentoExistente.data_pagamento = data_pagamento;
      return pagamentoExistente.save();
    }

    // Criar novo pagamento
    const pagamento = await Pagamento.create({
      reserva_id,
      usuario_id: reserva.usuario_id,
      valor,
      metodo,
      data_pagamento: data_pagamento || null,
      status: 'pendente'
    });

    return pagamento;
  }

  /**
   * Confirmar pagamento (marcar como pago)
   */
  async confirmar(id, data_pagamento, Pagamento) {
    const pagamento = await this.buscarPorId(id, Pagamento);

    pagamento.status = 'pago';
    pagamento.data_pagamento = data_pagamento || new Date().toISOString().split('T')[0];

    return pagamento.save();
  }

  /**
   * Cancelar pagamento
   */
  async cancelar(id, Pagamento) {
    const pagamento = await this.buscarPorId(id, Pagamento);

    pagamento.status = 'cancelado';
    return pagamento.save();
  }

  /**
   * Faturamento total de um período
   */
  async faturamentoTotal(data_inicio, data_fim, Pagamento) {
    const resultado = await Pagamento.findAll({
      attributes: [
        [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'total'],
        [Pagamento.sequelize.fn('COUNT', Pagamento.sequelize.col('id')), 'num_pagamentos']
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
      total: resultado[0].total || 0,
      num_pagamentos: parseInt(resultado[0].num_pagamentos) || 0
    };
  }

  /**
   * Faturamento por método de pagamento
   */
  async faturamentoPorMetodo(data_inicio, data_fim, Pagamento) {
    const resultado = await Pagamento.findAll({
      attributes: [
        'metodo',
        [Pagamento.sequelize.fn('SUM', Pagamento.sequelize.col('valor')), 'total'],
        [Pagamento.sequelize.fn('COUNT', Pagamento.sequelize.col('id')), 'quantidade']
      ],
      where: {
        status: 'pago',
        data_pagamento: {
          [Op.between]: [data_inicio, data_fim]
        }
      },
      groupAttributes: ['metodo'],
      raw: true
    });

    return resultado;
  }

  /**
   * Pagamentos pendentes
   */
  async listarPendentes(Pagamento, Usuario, Reserva) {
    const pagamentos = await Pagamento.findAll({
      where: { status: 'pendente' },
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'] },
        { model: Reserva, attributes: ['id', 'data'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return pagamentos;
  }
}

module.exports = new PagamentoService();
