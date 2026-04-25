const express = require('express');
const { Sequelize } = require('sequelize');
const app = require('./app');

// Models
const UsuarioModel = require('./models/Usuario');
const QuadraModel = require('./models/Quadra');
const ReservaModel = require('./models/Reserva');
const PagamentoModel = require('./models/Pagamento');
const TimeModel = require('./models/Time');
const JogadorModel = require('./models/Jogador');
const PartidaModel = require('./models/Partida');
const RankingModel = require('./models/Ranking');

require('dotenv').config();

// ============================================
// DATABASE SETUP
// ============================================

const sequelize = new Sequelize(
  process.env.DB_NAME || 'baiao_society',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false // Mudar para console.log para debug
  }
);

// Inicializar models
const db = {
  Usuario: UsuarioModel(sequelize),
  Quadra: QuadraModel(sequelize),
  Reserva: ReservaModel(sequelize),
  Pagamento: PagamentoModel(sequelize),
  Time: TimeModel(sequelize),
  Jogador: JogadorModel(sequelize),
  Partida: PartidaModel(sequelize),
  Ranking: RankingModel(sequelize)
};

// ============================================
// ASSOCIAÇÕES (Relacionamentos)
// ============================================

// Usuario -> Reservas (1:N)
db.Usuario.hasMany(db.Reserva, { foreignKey: 'usuario_id' });
db.Reserva.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Quadra -> Reservas (1:N)
db.Quadra.hasMany(db.Reserva, { foreignKey: 'quadra_id' });
db.Reserva.belongsTo(db.Quadra, { foreignKey: 'quadra_id' });

// Reserva -> Pagamento (1:1)
db.Reserva.hasOne(db.Pagamento, { foreignKey: 'reserva_id' });
db.Pagamento.belongsTo(db.Reserva, { foreignKey: 'reserva_id' });

// Usuario -> Pagamento (1:N)
db.Usuario.hasMany(db.Pagamento, { foreignKey: 'usuario_id' });
db.Pagamento.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Usuario -> Times (1:N) como capitão
db.Usuario.hasMany(db.Time, { foreignKey: 'capitao_id' });
db.Time.belongsTo(db.Usuario, { foreignKey: 'capitao_id' });

// Time -> Jogadores (1:N)
db.Time.hasMany(db.Jogador, { foreignKey: 'time_id' });
db.Jogador.belongsTo(db.Time, { foreignKey: 'time_id' });

// Usuario -> Jogadores (1:N)
db.Usuario.hasMany(db.Jogador, { foreignKey: 'usuario_id' });
db.Jogador.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Time -> Partidas (1:N) como time_a
db.Time.hasMany(db.Partida, { foreignKey: 'time_a_id' });
db.Partida.belongsTo(db.Time, { foreignKey: 'time_a_id', as: 'timeA' });

// Time -> Partidas (1:N) como time_b
db.Time.hasMany(db.Partida, { foreignKey: 'time_b_id' });
db.Partida.belongsTo(db.Time, { foreignKey: 'time_b_id', as: 'timeB' });

// Quadra -> Partidas (1:N)
db.Quadra.hasMany(db.Partida, { foreignKey: 'quadra_id' });
db.Partida.belongsTo(db.Quadra, { foreignKey: 'quadra_id' });

// Usuario -> Ranking (1:N)
db.Usuario.hasMany(db.Ranking, { foreignKey: 'usuario_id' });
db.Ranking.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

// Passar DB e Sequelize para a aplicação (para usar em controllers)
app.set('db', db);
app.set('sequelize', sequelize);

// ============================================
// INICIALIZAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Sincronizar models com BD (criar tabelas se não existirem)
    await sequelize.sync({ alter: true }); // alter: true = ajustar tabelas existentes
    console.log('✅ Modelos sincronizados com banco de dados');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
    });
  } catch (erro) {
    console.error('❌ Erro ao iniciar servidor:', erro.message);
    process.exit(1);
  }
};

// Executar
startServer();
