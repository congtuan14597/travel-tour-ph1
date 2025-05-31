const moment = require("moment");
const {
  getToursWithPaginationService
} = require("../../services/tour.service");
const {
  getCompletedBookingsByMonthService
} = require("../../services/booking.service");

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

let getCompletedBookingsByMonth = async (req, res) => {
  try {
    let month;
    if (req.query.month) {
      month = req.query.month;
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const monthNum = String(today.getMonth() + 1).padStart(2, "0");
      month = `${year}-${monthNum}`;
    }

    const result = await getCompletedBookingsByMonthService(month);

    res.render("user/tours/completed_bookings_detail", result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getTours,
  getCompletedBookingsByMonth,
};
