'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_export_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kind: {
        type: Sequelize.STRING,
        values: [
          "declarationList",
          "groupListVN",
          "groupListCN",
          "encryptedList"
        ]
      },
      filePath: {
        type: Sequelize.STRING
      },
      fileName: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        values: [
          "fail",
          "success",
          "fileDeleted"
        ]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('document_export_histories');
  }
};
