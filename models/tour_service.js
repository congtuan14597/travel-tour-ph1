'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourService extends Model {
    static associate(models) {
      // define association here
    }
  }
  TourService.init({
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'TourService',
    tableName: "tour_services",
    timestamps: true,
    paranoid: true
  });

  return TourService;
};
