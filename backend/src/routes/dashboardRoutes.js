const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

/**
 * Rotas de Dashboard
 * Base: /api/dashboard
 */

// Faturamento do mês
// GET /api/dashboard/faturamento-mes?mes=1&ano=2024
router.get('/faturamento-mes', dashboardController.faturamentoMes);

// Ocupação das quadras
// GET /api/dashboard/ocupacao-quadras
router.get('/ocupacao-quadras', dashboardController.ocupacaoQuadras);

// Horários mais alugados
// GET /api/dashboard/horarios-populares?limite=10
router.get('/horarios-populares', dashboardController.horariosMaisAlugados);

// Métodos de pagamento
// GET /api/dashboard/metodos-pagamento
router.get('/metodos-pagamento', dashboardController.metodosPagamento);

// Estatísticas gerais
// GET /api/dashboard/estatisticas
router.get('/estatisticas', dashboardController.estatisticas);

module.exports = router;
