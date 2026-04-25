const { DataTypes } = require('sequelize');

/**
 * Model: Time
 * Times do Baião Society
 */
module.exports = (sequelize) => {
  const Time = sequelize.define(
    'Time',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      capitao_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Time',
      tableName: 'times',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Time;
};
