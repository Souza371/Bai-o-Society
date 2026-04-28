/**
 * Script para popular banco com dados de teste
 * Execute com: node seed-manual.js
 */

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const UsuarioModel = require('./src/models/Usuario');
const QuadraModel = require('./src/models/Quadra');

const db = {
  Usuario: UsuarioModel(sequelize),
  Quadra: QuadraModel(sequelize)
};

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com BD estabelecida');

    // Sincronizar models
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Criar ou atualizar usuários sem apagar registros existentes
    const [admin, adminCriado] = await db.Usuario.findOrCreate({
      where: { email: 'admin@baiao.com' },
      defaults: {
      email: 'admin@baiao.com',
      senha_hash: '$2a$10$gC7KBWSf3vS5rVb5x2e/F.pAFSnTRHivXbuil6JOhRH/G/XQOHKs2', // admin123
      nome: 'Administrador',
      telefone: '(11) 99999-9999',
      perfil: 'admin',
      ativo: true
      }
    });
    if (!adminCriado) {
      await admin.update({
        senha_hash: '$2a$10$gC7KBWSf3vS5rVb5x2e/F.pAFSnTRHivXbuil6JOhRH/G/XQOHKs2',
        nome: 'Administrador',
        telefone: '(11) 99999-9999',
        perfil: 'admin',
        ativo: true
      });
    }
    console.log('✅ Usuário admin pronto');

    const [cliente, clienteCriado] = await db.Usuario.findOrCreate({
      where: { email: 'cliente@baiao.com' },
      defaults: {
      email: 'cliente@baiao.com',
      senha_hash: '$2a$10$bprqIu3z3E4BgEB2.L.DqevCc.j4mY4BTsMaGvA6vJFPTdTkZPNeK', // cliente123
      nome: 'Cliente Demo',
      telefone: '(11) 88888-8888',
      perfil: 'cliente',
      ativo: true
      }
    });
    if (!clienteCriado) {
      await cliente.update({
        senha_hash: '$2a$10$bprqIu3z3E4BgEB2.L.DqevCc.j4mY4BTsMaGvA6vJFPTdTkZPNeK',
        nome: 'Cliente Demo',
        telefone: '(11) 88888-8888',
        perfil: 'cliente',
        ativo: true
      });
    }
    console.log('✅ Usuário cliente pronto');

    // Criar quadras
    const quadrasBase = [
      {
        nome: 'Quadra A - Society',
        metragem: 420,
        preco_hora: 150.00,
        ativa: true
      },
      {
        nome: 'Quadra B - Campo',
        metragem: 500,
        preco_hora: 180.00,
        ativa: true
      },
      {
        nome: 'Quadra C - Poliesportiva',
        metragem: 600,
        preco_hora: 200.00,
        ativa: true
      }
    ];

    for (const quadraBase of quadrasBase) {
      const [quadra, quadraCriada] = await db.Quadra.findOrCreate({
        where: { nome: quadraBase.nome },
        defaults: quadraBase
      });

      if (!quadraCriada) {
        await quadra.update(quadraBase);
      }
    }
    console.log('✅ Quadras prontas');

    console.log('\n✅ ========================================');
    console.log('✅ SEED COMPLETO!');
    console.log('✅ ========================================');
    console.log('\n📱 CREDENCIAIS DE ACESSO:\n');
    console.log('👤 Admin:');
    console.log('   Email: admin@baiao.com');
    console.log('   Senha: admin123');
    console.log('   Perfil: Admin\n');
    console.log('👤 Cliente:');
    console.log('   Email: cliente@baiao.com');
    console.log('   Senha: cliente123');
    console.log('   Perfil: Cliente\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

seedData();
