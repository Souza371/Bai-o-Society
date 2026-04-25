const express = require('express');
const pagamentoController = require('../controllers/pagamentoController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de Pagamentos
 * Base: /api/pagamentos
 */

// Listar pagamentos (filtrado para clientes)
// GET /api/pagamentos?status=pendente
router.get('/', authenticate, pagamentoController.listar);

// Buscar pagamento por ID
// GET /api/pagamentos/:id
router.get('/:id', authenticate, pagamentoController.buscar);

// Registrar pagamento
// POST /api/pagamentos
router.post('/', authenticate, pagamentoController.registrar);

// Confirmar pagamento (ADMIN)
// PATCH /api/pagamentos/:id/confirmar
router.patch('/:id/confirmar', authenticate, requireAdmin, pagamentoController.confirmar);

// Cancelar pagamento
// DELETE /api/pagamentos/:id
router.delete('/:id', authenticate, pagamentoController.cancelar);

// Faturamento total (ADMIN)
// GET /api/pagamentos/relatorio/faturamento?data_inicio=2026-04-01&data_fim=2026-04-30
router.get('/relatorio/faturamento', authenticate, requireAdmin, pagamentoController.faturamento);

// Faturamento por método (ADMIN)
// GET /api/pagamentos/relatorio/por-metodo?data_inicio=2026-04-01&data_fim=2026-04-30
router.get('/relatorio/por-metodo', authenticate, requireAdmin, pagamentoController.faturamentoPorMetodo);

// Pagamentos pendentes (ADMIN)
// GET /api/pagamentos/pendentes/listar
router.get('/pendentes/listar', authenticate, requireAdmin, pagamentoController.pendentes);

module.exports = router;
