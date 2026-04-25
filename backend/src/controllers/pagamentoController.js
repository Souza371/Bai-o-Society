const pagamentoService = require('../services/pagamentoService');

/**
 * Controller: Pagamento
 * Endpoints HTTP de pagamentos
 */

class PagamentoController {
  /**
   * GET /api/pagamentos - Listar pagamentos
   */
  async listar(req, res) {
    try {
      const { status, usuario_id, metodo, data_inicio, data_fim } = req.query;

      const filtros = {};
      if (status) filtros.status = status;
      if (metodo) filtros.metodo = metodo;
      if (usuario_id) filtros.usuario_id = usuario_id;
      if (data_inicio && data_fim) {
        filtros.data_inicio = data_inicio;
        filtros.data_fim = data_fim;
      }

      // Clientes só veem seus próprios pagamentos
      if (req.user.perfil === 'cliente') {
        filtros.usuario_id = req.user.userId;
      }

      const pagamentos = await pagamentoService.listar(
        filtros,
        req.app.get('db').Pagamento,
        req.app.get('db').Usuario,
        req.app.get('db').Reserva
      );

      res.json({
        status: 'success',
        data: pagamentos
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/pagamentos/:id - Buscar pagamento
   */
  async buscar(req, res) {
    try {
      const { id } = req.params;

      const pagamento = await pagamentoService.buscarPorId(
        id,
        req.app.get('db').Pagamento,
        req.app.get('db').Usuario,
        req.app.get('db').Reserva
      );

      res.json({
        status: 'success',
        data: pagamento
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/pagamentos - Registrar pagamento
   */
  async registrar(req, res) {
    try {
      const pagamento = await pagamentoService.registrar(
        req.body,
        req.app.get('db').Pagamento,
        req.app.get('db').Reserva
      );

      res.status(201).json({
        status: 'success',
        message: 'Pagamento registrado com sucesso',
        data: pagamento
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PATCH /api/pagamentos/:id/confirmar - Confirmar pagamento (ADMIN)
   */
  async confirmar(req, res) {
    try {
      const { id } = req.params;
      const { data_pagamento } = req.body;

      const pagamento = await pagamentoService.confirmar(
        id,
        data_pagamento,
        req.app.get('db').Pagamento
      );

      res.json({
        status: 'success',
        message: 'Pagamento confirmado com sucesso',
        data: pagamento
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * DELETE /api/pagamentos/:id - Cancelar pagamento
   */
  async cancelar(req, res) {
    try {
      const { id } = req.params;

      const pagamento = await pagamentoService.cancelar(
        id,
        req.app.get('db').Pagamento
      );

      res.json({
        status: 'success',
        message: 'Pagamento cancelado com sucesso',
        data: pagamento
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/pagamentos/relatorio/faturamento?data_inicio=2026-04-01&data_fim=2026-04-30
   */
  async faturamento(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({
          status: 'error',
          message: 'data_inicio e data_fim são obrigatórias',
          code: 'VALIDACAO_ERRO'
        });
      }

      const total = await pagamentoService.faturamentoTotal(
        data_inicio,
        data_fim,
        req.app.get('db').Pagamento
      );

      res.json({
        status: 'success',
        data: total
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/pagamentos/relatorio/por-metodo?data_inicio=2026-04-01&data_fim=2026-04-30
   */
  async faturamentoPorMetodo(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({
          status: 'error',
          message: 'data_inicio e data_fim são obrigatórias',
          code: 'VALIDACAO_ERRO'
        });
      }

      const resultado = await pagamentoService.faturamentoPorMetodo(
        data_inicio,
        data_fim,
        req.app.get('db').Pagamento
      );

      res.json({
        status: 'success',
        data: resultado
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/pagamentos/pendentes/listar - Pagamentos pendentes (ADMIN)
   */
  async pendentes(req, res) {
    try {
      const pagamentos = await pagamentoService.listarPendentes(
        req.app.get('db').Pagamento,
        req.app.get('db').Usuario,
        req.app.get('db').Reserva
      );

      res.json({
        status: 'success',
        data: pagamentos
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('PagamentoController Error:', erro);

    if (erro.status && erro.message) {
      return res.status(erro.status).json({
        status: 'error',
        message: erro.message,
        code: erro.code
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
      code: 'SERVER_ERROR'
    });
  }
}

module.exports = new PagamentoController();
