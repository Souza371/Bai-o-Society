/**
 * Seed: Dados de Demo
 * Popula banco com dados de teste
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar usuários demo
    await queryInterface.bulkInsert('usuarios', [
      {
        email: 'admin@baiao.com',
        senha_hash: '$2a$10$gC7KBWSf3vS5rVb5x2e/F.pAFSnTRHivXbuil6JOhRH/G/XQOHKs2', // admin123
        nome: 'Administrador',
        telefone: '(11) 99999-9999',
        perfil: 'admin',
        ativo: true,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        email: 'cliente@baiao.com',
        senha_hash: '$2a$10$bprqIu3z3E4BgEB2.L.DqevCc.j4mY4BTsMaGvA6vJFPTdTkZPNeK', // cliente123
        nome: 'Cliente Demo',
        telefone: '(11) 88888-8888',
        perfil: 'cliente',
        ativo: true,
        criado_em: new Date(),
        atualizado_em: new Date()
      }
    ], {});

    // Criar quadra demo
    await queryInterface.bulkInsert('quadras', [
      {
        nome: 'Campo Baião Society',
        metragem: 500,
        preco_hora: 150.00,
        ativa: true,
        criado_em: new Date(),
        atualizado_em: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('quadras', null, {});
  }
};
