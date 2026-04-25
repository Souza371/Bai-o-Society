const dashboardService = require('../services/dashboardService');

/**
 * Controller: Dashboard
 * Endpoints HTTP de analytics e métricas
 */

class DashboardController {
  /**
   * GET /api/dashboard/faturamento-mes - Faturamento do mês atual
   */
  async faturamentoMes(req, res) {
    try {
      const hoje = new Date();
      const mes = req.query.mes || hoje.getMonth() + 1;
      const ano = req.query.ano || hoje.getFullYear();

      const resultado = await dashboardService.faturamentoMes(
        parseInt(mes),
        parseInt(ano),
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
   * GET /api/dashboard/ocupacao-quadras - Ocupação das quadras
   */
  async ocupacaoQuadras(req, res) {
    try {
      const resultado = await dashboardService.ocupacaoQuadras(
        req.app.get('db').Reserva,
        req.app.get('db').Quadra
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
   * GET /api/dashboard/horarios-populares - Horários mais alugados
   */
  async horariosMaisAlugados(req, res) {
    try {
      const limite = req.query.limite || 5;

      const resultado = await dashboardService.horariosMaisAlugados(
        parseInt(limite),
        req.app.get('db').Reserva
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
   * GET /api/dashboard/metodos-pagamento - Métodos de pagamento mais usados
   */
  async metodosPagamento(req, res) {
    try {
      const resultado = await dashboardService.metodosPagamento(
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
   * GET /api/dashboard/estatisticas - Estatísticas gerais do sistema
   */
  async estatisticas(req, res) {
    try {
      const resultado = await dashboardService.estatisticasGerais(
        req.app.get('db').Usuario,
        req.app.get('db').Quadra,
        req.app.get('db').Reserva,
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

  handleError(erro, res) {
    console.error('DashboardController Error:', erro);

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

module.exports = new DashboardController();
