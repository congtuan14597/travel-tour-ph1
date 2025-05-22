const moment = require("moment");
const { Tour, Booking, Journey, User } = require("../../../models");
const { buildTourFilter } = require("../../services/tour.service");
const {
  getCompletedBookingsByMonth: getCompletedBookingsByMonthService
} = require("../../services/booking.service");

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

let getTourRevenue = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{
        model: Tour,
        as: "tours",
        attributes: ["price", "vatIncluded"]
      }],
      where: { deletedAt: null },
    });

    let totalBookings = 0;
    let totalCustomers = 0;
    let totalRevenues = 0;

    let bookingsPerMonth = {};
    let customersPerMonth = {};
    let revenuesPerMonth = {};

    for (const booking of bookings) {
      const month = moment(booking.bookingDate).format("YYYY/MM");

      const people = booking.numberPeople || 0;
      const price = booking.tours?.price || 0;
      const vatIncluded = booking.tours?.vatIncluded;

      const revenue = vatIncluded ? people * price : people * price * 1.1;

      totalBookings += 1;
      totalCustomers += people;
      totalRevenues += revenue;

      bookingsPerMonth[month] = (bookingsPerMonth[month] || 0) + 1;
      customersPerMonth[month] = (customersPerMonth[month] || 0) + people;
      revenuesPerMonth[month] = (revenuesPerMonth[month] || 0) + revenue;
    }

    res.render("admin/tours/revenue", {
      totalBookings,
      totalCustomers,
      totalRevenues,
      bookingsPerMonth,
      customersPerMonth,
      revenuesPerMonth,
    });
  } catch (error) {
    res.status(500).send("Internet Server Error");
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
      const monthNum = String(today.getMonth() + 1).padStart(2, '0');
      month = `${year}-${monthNum}`;
    }

    const result = await getCompletedBookingsByMonthService(month);
    res.render("admin/tours/completed_bookings_detail", result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getTours,
  getTourDetails,
  getTourRevenue,
  getCompletedBookingsByMonth,
};
