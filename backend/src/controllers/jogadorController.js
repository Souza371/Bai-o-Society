const jogadorService = require('../services/jogadorService');

/**
 * Controller: Jogador
 * Endpoints HTTP de jogadores
 */

class JogadorController {
  /**
   * GET /api/times/:time_id/jogadores - Listar jogadores do time
   */
  async listar(req, res) {
    try {
      const { time_id } = req.params;

      const jogadores = await jogadorService.listarPorTime(
        time_id,
        req.app.get('db').Jogador,
        req.app.get('db').Usuario,
        req.app.get('db').Time
      );

      res.json({
        status: 'success',
        data: jogadores
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/jogadores/:id - Buscar jogador
   */
  async buscar(req, res) {
    try {
      const { id } = req.params;

      const jogador = await jogadorService.buscarPorId(
        id,
        req.app.get('db').Jogador,
        req.app.get('db').Usuario
      );

      res.json({
        status: 'success',
        data: jogador
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/jogadores - Adicionar jogador ao time
   */
  async adicionar(req, res) {
    try {
      const jogador = await jogadorService.adicionar(
        req.body,
        req.app.get('db').Jogador,
        req.app.get('db').Usuario,
        req.app.get('db').Time
      );

      res.status(201).json({
        status: 'success',
        message: 'Jogador adicionado ao time com sucesso',
        data: jogador
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PUT /api/jogadores/:id - Atualizar jogador
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;

      const jogador = await jogadorService.atualizar(
        id,
        req.body,
        req.app.get('db').Jogador
      );

      res.json({
        status: 'success',
        message: 'Jogador atualizado com sucesso',
        data: jogador
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * DELETE /api/jogadores/:id - Remover jogador do time
   */
  async remover(req, res) {
    try {
      const { id } = req.params;

      const jogador = await jogadorService.remover(
        id,
        req.app.get('db').Jogador
      );

      res.json({
        status: 'success',
        message: 'Jogador removido do time com sucesso',
        data: jogador
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('JogadorController Error:', erro);

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

module.exports = new JogadorController();
