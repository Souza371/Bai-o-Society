const express = require('express');
const quadraController = require('../controllers/quadraController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de Quadras
 * Base: /api/quadras
 */

// Listar quadras
// GET /api/quadras
router.get('/', quadraController.listar);

// Buscar quadra por ID
// GET /api/quadras/:id
router.get('/:id', quadraController.buscar);

// Criar quadra (ADMIN)
// POST /api/quadras
router.post('/', authenticate, requireAdmin, quadraController.criar);

// Atualizar quadra (ADMIN)
// PUT /api/quadras/:id
router.put('/:id', authenticate, requireAdmin, quadraController.atualizar);

// Desativar quadra (ADMIN)
// DELETE /api/quadras/:id
router.delete('/:id', authenticate, requireAdmin, quadraController.desativar);

module.exports = router;
