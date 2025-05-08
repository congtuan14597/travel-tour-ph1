const moment = require("moment");
const { Tour, Booking, Journey, User } = require("../../../models");
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

let getTourDetails = async (req, res) => {
  const tourId = req.params.id;
  const bookingLimit = 20;
  const bookingPage = parseInt(req.query.bookingPage) || 1;
  const bookingOffset = (bookingPage - 1) * bookingLimit;

  try {
    const tour = await Tour.findOne({
      where: { id: tourId, deletedAt: null },
      include: [{
        model: Journey,
        as: "journeys",
        order: [["createdAt", "DESC"]],
      }],
    });

    if (!tour)  return res.status(404).send("Không tìm thấy tour");

    const {
      count: bookingCount, rows: bookingRows
    } = await Booking.findAndCountAll({
      where: { tourId: tour.id },
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name"],
        },
      ],
      limit: bookingLimit,
      offset: bookingOffset,
      order: [["bookingDate", "DESC"]],
    });

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

    const tourData = tour.toJSON();
    const bookings = bookingRows.map(booking => ({
      ...booking.toJSON(),
      textStatus: bookingStatusMap[booking.status],
    }));

    const totalBookingPages = Math.ceil(bookingCount / bookingLimit);

    res.render("admin/tours/show", {
      tour: {
        ...tourData,
        textType: tourTypeMap[tourData.type],
        bookings,
      },
      currentPage: bookingPage,
      totalPages: totalBookingPages,
      limit: bookingLimit,
      moment
    })
  } catch (error) {
    res.status(500).send("Internet Server Error");
  }
};

module.exports = {
  getTours,
  getTourDetails,
};
