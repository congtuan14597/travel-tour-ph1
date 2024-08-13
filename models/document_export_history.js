'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentExportHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DocumentExportHistory.init({
    kind: {
      type: DataTypes.ENUM,
      values: [
        "declarationList",
        "groupListVN",
        "groupListCN",
        "encryptedList"
      ]
    },
    filePath: DataTypes.STRING,
    fileName: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: [
        "fail",
        "success",
        "fileDeleted"
      ]
    }
  }, {
    sequelize,
    modelName: 'DocumentExportHistory',
    tableName: "document_export_histories"
  });
  return DocumentExportHistory;
};
