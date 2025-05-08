const moment = require("moment");
const { Tour, Booking } = require("../../../models");
const { buildTourFilter } = require("../../services/tour.service");

let getTours = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const tourTypeMap = {
    "1": "Quốc tế",
    "2": "Nội địa",
    "3": "Tự thiết kế",
  };
  const bookingStatusMap = {
    "1": "Chờ xác nhận",
    "2": "Đã xác nhận",
    "3": "Đã hủy",
    "4": "Đã hoàn thành",
    "5": "Thất bại",
  };

  try {
    const whereCondition = buildTourFilter(req.query);

    const { count, rows } = await Tour.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    const tours = rows.map(tour => {
      const tourData = tour.toJSON();
      return {
        ... tourData,
        textType: tourTypeMap[tourData.type],
      }
    });

    const totalPages = Math.ceil(count / limit);

    res.render("admin/tours/index", {
      tours: tours,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment,
      query: req.query,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getTours,
};
