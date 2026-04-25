const express = require('express');
const rankingController = require('../controllers/rankingController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de Ranking
 * Base: /api/ranking
 */

// Ranking geral
// GET /api/ranking/geral?limite=20
router.get('/geral', rankingController.rankingGeral);

// Ranking mensal (últimos 30 dias)
// GET /api/ranking/mensal
router.get('/mensal', rankingController.rankingMensal);

// Ranking por desempenho
// GET /api/ranking/desempenho
router.get('/desempenho', rankingController.rankingDesempenho);

// Ranking de um time específico
// GET /api/ranking/time/:time_id
router.get('/time/:time_id', rankingController.buscarPorTime);

// Registrar partida
// POST /api/ranking/registrar-partida
router.post('/registrar-partida', authenticate, rankingController.registrarPartida);

// Resetar ranking (admin)
// DELETE /api/ranking/resetar
router.delete('/resetar', authenticate, requireAdmin, rankingController.resetar);

module.exports = router;
