'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documentNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardID: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      dayOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("Nam", "Nữ", "Khác"),
        allowNull: false
      },
      national: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      village: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      createdAtCard: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      placeOfBirth: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      commune: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provinceCode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      districtCode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      communeCode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
