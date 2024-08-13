const moment = require("moment");
const fs = require("fs");
const {DocumentExportHistory} = require("../../../models");

let getDocumentExportHistories = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await DocumentExportHistory.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.render("admin/document_export_hitories/index", {
      documentExportHistories: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let downloadDocumentExportHistories = async (req, res) => {
  try {
    const documentExport = await DocumentExportHistory.findByPk(req.params.id);
    const filePath = documentExport.filePath;
    if (fs.existsSync(filePath)) {
      res.download(filePath, (error) => {
        if (error) {throw error;}
      });
    } else {
      const error = "File không tồn tại";
      throw error;
    }
  } catch (error) {
    res.status(500).send({error: error});
  }
}

module.exports = {
  getDocumentExportHistories,
  downloadDocumentExportHistories
};
