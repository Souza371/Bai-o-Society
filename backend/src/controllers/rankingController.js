const rankingService = require('../services/rankingService');

/**
 * Controller: Ranking
 * Endpoints HTTP de leaderboards
 */

class RankingController {
  /**
   * GET /api/ranking/geral - Ranking geral
   */
  async rankingGeral(req, res) {
    try {
      const limite = req.query.limite || 10;

      const ranking = await rankingService.rankingGeral(
        parseInt(limite),
        req.app.get('db').Ranking,
        req.app.get('db').Time
      );

      res.json({
        status: 'success',
        data: ranking
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/ranking/mensal - Ranking do mês
   */
  async rankingMensal(req, res) {
    try {
      const ranking = await rankingService.rankingMensal(
        req.app.get('db').Ranking,
        req.app.get('db').Partida,
        req.app.get('db').Time
      );

      res.json({
        status: 'success',
        data: ranking
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/ranking/desempenho - Ranking por desempenho (pontos/jogo)
   */
  async rankingDesempenho(req, res) {
    try {
      const ranking = await rankingService.rankingPorDesempenho(
        req.app.get('db').Ranking
      );

      res.json({
        status: 'success',
        data: ranking
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/ranking/time/:time_id - Ranking de um time específico
   */
  async buscarPorTime(req, res) {
    try {
      const { time_id } = req.params;

      const ranking = await rankingService.buscarPorTime(
        time_id,
        req.app.get('db').Ranking
      );

      res.json({
        status: 'success',
        data: ranking
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/ranking/registrar-partida - Registrar partida e atualizar ranking
   */
  async registrarPartida(req, res) {
    try {
      const resultado = await rankingService.registrarPartida(
        req.body,
        req.app.get('db').Ranking,
        req.app.get('db').Partida,
        req.app.get('db').Jogador
      );

      res.status(201).json({
        status: 'success',
        message: 'Partida registrada e ranking atualizado',
        data: resultado
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * DELETE /api/ranking/resetar - Resetar ranking (admin)
   */
  async resetar(req, res) {
    try {
      const resultado = await rankingService.resetarRanking(
        req.app.get('db').Ranking
      );

      res.json({
        status: 'success',
        message: resultado.message,
        data: resultado
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('RankingController Error:', erro);

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

module.exports = new RankingController();
