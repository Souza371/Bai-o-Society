const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

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
