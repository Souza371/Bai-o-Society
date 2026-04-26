const express = require('express');
const reservaController = require('../controllers/reservaController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de Reservas
 * Base: /api/reservas
 */

// Calendario de disponibilidades
// GET /api/reservas/calendario?mes=4&ano=2026
router.get('/calendario/disponibilidades', authenticate, reservaController.obterCalendario);

// Horários livres de uma quadra
// GET /api/reservas/horarios-livres?quadra_id=1&data=2026-04-25
router.get('/horarios-livres', reservaController.horariosLivres);

// Listar reservas (filtrado por user se cliente)
// GET /api/reservas?quadra_id=1&data=2026-04-25&status=confirmada
router.get('/', authenticate, reservaController.listar);

// Criar nova reserva
// POST /api/reservas
router.post('/', authenticate, reservaController.criar);

// Buscar reserva por ID
// GET /api/reservas/:id
router.get('/:id', authenticate, reservaController.buscar);

// Atualizar reserva
// PUT /api/reservas/:id
router.put('/:id', authenticate, reservaController.atualizar);

// Cancelar reserva
// DELETE /api/reservas/:id
router.delete('/:id', authenticate, reservaController.cancelar);

// Confirmar reserva (ADMIN)
// PATCH /api/reservas/:id/confirmar
router.patch('/:id/confirmar', authenticate, requireAdmin, reservaController.confirmar);

module.exports = router;
