const timeService = require('../services/timeService');

/**
 * Controller: Time
 * Endpoints HTTP de times
 */

class TimeController {
  /**
   * GET /api/times - Listar times
   */
  async listar(req, res) {
    try {
      const { ativo } = req.query;
      const filtros = {};

      if (ativo !== undefined) {
        filtros.ativo = ativo === 'true';
      }

      const times = await timeService.listar(
        filtros,
        req.app.get('db').Time,
        req.app.get('db').Usuario
      );

      res.json({
        status: 'success',
        data: times
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/times/:id - Buscar time
   */
  async buscar(req, res) {
    try {
      const { id } = req.params;

      const time = await timeService.buscarPorId(
        id,
        req.app.get('db').Time,
        req.app.get('db').Usuario,
        req.app.get('db').Jogador
      );

      res.json({
        status: 'success',
        data: time
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/times - Criar time
   */
  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      const capitao_id = req.user.userId; // Quem cria é o capitão

      const time = await timeService.criar(
        { nome, descricao, capitao_id },
        req.app.get('db').Time
      );

      res.status(201).json({
        status: 'success',
        message: 'Time criado com sucesso',
        data: time
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PUT /api/times/:id - Atualizar time
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;

      const time = await timeService.atualizar(
        id,
        req.body,
        req.app.get('db').Time
      );

      res.json({
        status: 'success',
        message: 'Time atualizado com sucesso',
        data: time
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PATCH /api/times/:id/desativar - Desativar time
   */
  async desativar(req, res) {
    try {
      const { id } = req.params;

      const time = await timeService.desativar(id, req.app.get('db').Time);

      res.json({
        status: 'success',
        message: 'Time desativado com sucesso',
        data: time
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PATCH /api/times/:id/ativar - Ativar time
   */
  async ativar(req, res) {
    try {
      const { id } = req.params;

      const time = await timeService.ativar(id, req.app.get('db').Time);

      res.json({
        status: 'success',
        message: 'Time ativado com sucesso',
        data: time
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('TimeController Error:', erro);

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

module.exports = new TimeController();
