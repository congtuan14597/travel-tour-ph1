'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Journey extends Model {
    static associate(models) {
      Journey.belongsTo(models.Tour, {
        foreignKey: 'tourId',
        as: 'tours',
      });
    }
  }
  Journey.init({
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Journey',
    tableName: "journeys",
    timestamps: true,
    paranoid: true
  });

  return Journey;
};
