const express = require("express");
const router = express.Router();
const controller = require("../controllers/perform_analysis_file.js");

let routes = (app) => {
  router.post("/api/v1/files/perform_analysis", controller.perform);

  app.use(router);
};

module.exports = routes;
