const express = require('express');
const timeController = require('../controllers/timeController');
const jogadorController = require('../controllers/jogadorController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de Times
 * Base: /api/times
 */

// Listar times
// GET /api/times
router.get('/', timeController.listar);

// Buscar time por ID
// GET /api/times/:id
router.get('/:id', timeController.buscar);

// Criar time
// POST /api/times
router.post('/', authenticate, timeController.criar);

// Atualizar time
// PUT /api/times/:id
router.put('/:id', authenticate, timeController.atualizar);

// Desativar time
// PATCH /api/times/:id/desativar
router.patch('/:id/desativar', authenticate, timeController.desativar);

// Ativar time
// PATCH /api/times/:id/ativar
router.patch('/:id/ativar', authenticate, timeController.ativar);

// =========================================
// Rotas de Jogadores
// =========================================

// Listar jogadores do time
// GET /api/times/:time_id/jogadores
router.get('/:time_id/jogadores', jogadorController.listar);

// Adicionar jogador
// POST /api/jogadores
router.post('/', authenticate, jogadorController.adicionar);

// Buscar jogador
// GET /api/jogadores/:id
router.get('/jogador/:id', jogadorController.buscar);

// Atualizar jogador
// PUT /api/jogadores/:id
router.put('/jogador/:id', authenticate, jogadorController.atualizar);

// Remover jogador
// DELETE /api/jogadores/:id
router.delete('/jogador/:id', authenticate, jogadorController.remover);

module.exports = router;
