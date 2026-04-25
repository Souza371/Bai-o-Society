const { DataTypes } = require('sequelize');

/**
 * Model: Pagamento
 * Controle financeiro de reservas
 */
module.exports = (sequelize) => {
  const Pagamento = sequelize.define(
    'Pagamento',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reserva_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'reservas', key: 'id' }
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      data_pagamento: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      metodo: {
        type: DataTypes.ENUM('dinheiro', 'cartao', 'pix', 'boleto'),
        defaultValue: 'dinheiro'
      },
      status: {
        type: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
        defaultValue: 'pendente'
      },
      referencia_externa: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Pagamento',
      tableName: 'pagamentos',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Pagamento;
};
