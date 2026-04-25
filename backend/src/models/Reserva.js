const { DataTypes } = require('sequelize');

/**
 * Model: Reserva
 * CORE DO SISTEMA - Representa reservas de quadra
 * Validações críticas aqui!
 */
module.exports = (sequelize) => {
  const Reserva = sequelize.define(
    'Reserva',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quadra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'quadras', key: 'id' }
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
      },
      hora_fim: {
        type: DataTypes.TIME,
        allowNull: false
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),
        defaultValue: 'pendente'
      }
    },
    {
      sequelize,
      modelName: 'Reserva',
      tableName: 'reservas',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em',
      indexes: [
        {
          unique: true,
          fields: ['quadra_id', 'data', 'hora_inicio', 'hora_fim'],
          where: { status: { [sequelize.Sequelize.Op.ne]: 'cancelada' } }
        },
        { fields: ['quadra_id', 'data'] },
        { fields: ['usuario_id'] },
        { fields: ['data'] }
      ]
    }
  );

  return Reserva;
};
