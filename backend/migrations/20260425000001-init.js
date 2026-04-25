'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela Usuários
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      senha_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      perfil: {
        type: Sequelize.ENUM('admin', 'cliente'),
        defaultValue: 'cliente',
        allowNull: false
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Quadras
    await queryInterface.createTable('quadras', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tipo: {
        type: Sequelize.ENUM('futsal', 'futebol', 'volei', 'multipla'),
        defaultValue: 'futsal'
      },
      metragem: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      preco_hora: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ativa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Reservas
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quadra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quadras', key: 'id' }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fim: {
        type: Sequelize.TIME,
        allowNull: false
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pendente', 'confirmada', 'cancelada'),
        defaultValue: 'pendente'
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Pagamentos
    await queryInterface.createTable('pagamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reserva_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'reservas', key: 'id' }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      data_pagamento: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      metodo: {
        type: Sequelize.ENUM('dinheiro', 'cartao', 'pix', 'boleto'),
        defaultValue: 'dinheiro'
      },
      status: {
        type: Sequelize.ENUM('pendente', 'pago', 'cancelado'),
        defaultValue: 'pendente'
      },
      referencia_externa: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Times
    await queryInterface.createTable('times', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      treinador_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' }
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Jogadores
    await queryInterface.createTable('jogadores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'usuarios', key: 'id' }
      },
      time_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'times', key: 'id' }
      },
      posicao: {
        type: Sequelize.ENUM('goleiro', 'defesa', 'meio', 'ataque'),
        allowNull: true
      },
      numero_camisa: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Partidas
    await queryInterface.createTable('partidas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reserva_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'reservas', key: 'id' }
      },
      time_a_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'times', key: 'id' }
      },
      time_b_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'times', key: 'id' }
      },
      gols_time_a: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      gols_time_b: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('agendada', 'em_andamento', 'finalizada', 'cancelada'),
        defaultValue: 'agendada'
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela Rankings
    await queryInterface.createTable('rankings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      time_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'times', key: 'id' }
      },
      vitoria: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      derrota: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      empate: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      gols_favor: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      gols_contra: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rankings');
    await queryInterface.dropTable('partidas');
    await queryInterface.dropTable('jogadores');
    await queryInterface.dropTable('times');
    await queryInterface.dropTable('pagamentos');
    await queryInterface.dropTable('reservas');
    await queryInterface.dropTable('quadras');
    await queryInterface.dropTable('usuarios');
  }
};
