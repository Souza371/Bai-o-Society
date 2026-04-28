const express = require('express');
const authController = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Rotas de autenticação
 * Base: /api/auth
 */

// Registrar novo usuário
// POST /api/auth/register
router.post('/register', authController.register);

// Login
// POST /api/auth/login
router.post('/login', authController.login);

// Refresh token
// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// Perfil atual
// GET /api/auth/me
router.get('/me', authenticate, authController.me);

// Atualizar perfil atual
// PATCH /api/auth/me
router.patch('/me', authenticate, authController.atualizarMe);

// Listar usuários (ADMIN)
// GET /api/auth/users
router.get('/users', authenticate, requireAdmin, authController.listarUsuarios);

// Verificar se token é válido (teste)
// GET /api/auth/verify
router.get('/verify', authenticate, (req, res) => {
  res.json({
    status: 'success',
    message: 'Token válido',
    user: req.user
  });
});

module.exports = router;
