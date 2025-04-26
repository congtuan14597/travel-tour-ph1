'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tours', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      departure: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      durationDays: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      vatIncluded: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      type: {
        type: Sequelize.ENUM('1', '2', '3'),
        allowNull: true,
        defaultValue: '1',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tours');
  }
};
