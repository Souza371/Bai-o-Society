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
const rankingRoutes = require('./routes/rankingRoutes');

// Criar app Express
const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// CORS - Permitir requisições de Codespaces e local
const corsOptions = {
  origin: (origin, callback) => {
    // Em desenvolvimento, permitir qualquer origin
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Em produção, validar origem
    const allowedOrigins = [
      'http://localhost:3000',
      process.env.CLIENT_URL
    ];
    
    if (!origin || allowedOrigins.includes(origin) || origin.includes('app.github.dev')) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// Middleware para preflight requests
app.options('*', cors(corsOptions));

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
app.use('/api/ranking', rankingRoutes);

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
