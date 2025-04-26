'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourReview extends Model {
    static associate(models) {
      TourReview.belongsTo(models.Tour, {
        foreignKey: 'tourId',
        as: 'tours',
      });
      TourReview.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customers',
      });
    }
  }
  TourReview.init({
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'TourReview',
    tableName: "tour_reviews",
    timestamps: true,
    paranoid: true
  });

  return TourReview;
};
