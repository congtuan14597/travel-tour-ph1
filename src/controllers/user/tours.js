const moment = require("moment");
const {
  getToursWithPaginationService
} = require("../../services/tour.service")

let getTours = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await getToursWithPaginationService(req.query, page);
    res.render("user/tours/index", {
      ...result,
      moment,
      query: req.query,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getTours,
};
