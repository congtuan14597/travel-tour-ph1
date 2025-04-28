const moment = require("moment");
const { Tour, Booking } = require("../../../models");
const { Op } = require("sequelize");

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
    const {
      name, destination, departure, type, priceMin, priceMax
    } = req.query;

    const whereCondition = {
      deletedAt: null
    };

    if (req.query.name) {
      whereCondition.name = { [Op.like]: `%${name}%`}
    }

    if (req.query.destination) {
      whereCondition.destination = { [Op.like]: `%${destination}%`}
    }

    if (req.query.departure) {
      whereCondition.departure = { [Op.like]: `%${departure}%`}
    }

    if (type) {
      whereCondition.type = type;
    }

    if (priceMin && priceMax) {
      whereCondition.price = { [Op.between]: [priceMin, priceMax] };
    } else if (priceMin) {
      whereCondition.price = { [Op.gte]: priceMin };
    } else if (priceMax) {
      whereCondition.price = { [Op.lte]: priceMax };
    }

    const { count, rows } = await Tour.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
      include: [{
        model: Booking,
        as: "bookings"
      }]
    });

    const tours = rows.map(tour => {
      const mappedBookings = tour.bookings.map(booking => {
        const bookingData = booking.toJSON();
        return {
          ...bookingData,
          textStatus: bookingStatusMap[bookingData.status],
        };
      });
      const tourData = tour.toJSON();
      return {
        ... tourData,
        textType: tourTypeMap[tourData.type],
        bookings: mappedBookings,
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
