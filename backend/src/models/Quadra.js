const { DataTypes } = require('sequelize');

/**
 * Model: Quadra
 * Representa as quadras esportivas do Baião Society
 */
module.exports = (sequelize) => {
  const Quadra = sequelize.define(
    'Quadra',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        example: 'Quadra 1 - Futsal'
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tipo: {
        type: DataTypes.ENUM('futsal', 'futebol', 'volei', 'multipla'),
        defaultValue: 'futsal'
      },
      metragem: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      preco_hora: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        example: 80.00
      },
      imagem_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ativa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Quadra',
      tableName: 'quadras',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Quadra;
};
