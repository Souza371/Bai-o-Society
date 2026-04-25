const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import das rotas
const authRoutes = require('./routes/authRoutes');
const quadraRoutes = require('./routes/quadraRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const timeRoutes = require('./routes/timeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Criar app Express
const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser (JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============================================
// ROTAS
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/quadras', quadraRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/times', timeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    code: 'NOT_FOUND'
  });
});

// ============================================
// ERROR HANDLER GLOBAL
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
    code: err.code || 'SERVER_ERROR'
  });
});

module.exports = app;
