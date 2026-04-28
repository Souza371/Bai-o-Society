const quadraService = require('../services/quadraService');

/**
 * Controller: Quadra
 * Endpoints HTTP de quadras
 */

class QuadraController {
  constructor() {
    this.listar = this.listar.bind(this);
    this.buscar = this.buscar.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.desativar = this.desativar.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * GET /api/quadras - Listar quadras
   */
  async listar(req, res) {
    try {
      const { inativas } = req.query;
      const ativas = inativas !== 'true';

      const quadras = await quadraService.listar(req.app.get('db').Quadra, ativas);

      res.json({
        status: 'success',
        data: quadras
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/quadras/:id - Buscar quadra
   */
  async buscar(req, res) {
    try {
      const { id } = req.params;
      const quadra = await quadraService.buscarPorId(req.app.get('db').Quadra, id);

      res.json({
        status: 'success',
        data: quadra
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/quadras - Criar quadra (ADMIN)
   */
  async criar(req, res) {
    try {
      const quadra = await quadraService.criar(req.body, req.app.get('db').Quadra);

      res.status(201).json({
        status: 'success',
        message: 'Quadra criada com sucesso',
        data: quadra
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PUT /api/quadras/:id - Atualizar quadra (ADMIN)
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const quadra = await quadraService.atualizar(id, req.body, req.app.get('db').Quadra);

      res.json({
        status: 'success',
        message: 'Quadra atualizada com sucesso',
        data: quadra
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * DELETE /api/quadras/:id - Desativar quadra (ADMIN)
   */
  async desativar(req, res) {
    try {
      const { id } = req.params;
      const quadra = await quadraService.desativar(id, req.app.get('db').Quadra);

      res.json({
        status: 'success',
        message: 'Quadra desativada com sucesso',
        data: quadra
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('QuadraController Error:', erro);

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

module.exports = new QuadraController();
