const { Tour, Journey, Booking, User } = require("../../models");
const { Op } = require("sequelize");
const moment = require("moment");

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

function buildTourFilter(query) {
  const {
    name, destination, departure, type, priceMin, priceMax
  } = query;

  const where = {
    deletedAt: null
  };

  if (name) {
    where.name = { [Op.like]: `%${name}%`}
  }

  if (destination) {
    where.destination = { [Op.like]: `%${destination}%`}
  }

  if (departure) {
    where.departure = { [Op.like]: `%${departure}%`}
  }

  if (type) {
    where.type = type;
  }

  if (priceMin && priceMax) {
    where.price = { [Op.between]: [priceMin, priceMax] };
  } else if (priceMin) {
    where.price = { [Op.gte]: priceMin };
  } else if (priceMax) {
    where.price = { [Op.lte]: priceMax };
  }

  return where;
}

const getToursWithPaginationService = async (query, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const whereCondition = buildTourFilter(query);

  const { count, rows } = await Tour.findAndCountAll({
    where: whereCondition,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const tours = rows.map(tour => ({
    ...tour.toJSON(),
    textType: tourTypeMap[tour.type],
  }));

  return {
    tours,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    limit,
  };
};

const getTourDetailsWithBookingsService = async (
  tourId, bookingPage = 1, bookingLimit = 20
) => {
  const tour = await Tour.findOne({
    where: { id: tourId, deletedAt: null },
    include: [{
      model: Journey,
      as: "journeys",
      order: [["createdAt", "DESC"]],
    }],
  });

  if (!tour) return null;

  const bookingOffset = (bookingPage - 1) * bookingLimit;
  const { count: bookingCount, rows: bookingRows } = await Booking.findAndCountAll({
    where: { tourId: tour.id },
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "name"],
    }],
    limit: bookingLimit,
    offset: bookingOffset,
    order: [["bookingDate", "DESC"]],
  });

  const tourData = tour.toJSON();
  const bookings = bookingRows.map(booking => ({
    ...booking.toJSON(),
    textStatus: bookingStatusMap[booking.status],
  }));

  return {
    tour: {
      ...tourData,
      textType: tourTypeMap[tourData.type],
      bookings,
    },
    currentPage: bookingPage,
    totalPages: Math.ceil(bookingCount / bookingLimit),
    limit: bookingLimit,
  };
};

const sortMonthlyData = (data) => {
  return Object.keys(data)
    .sort((a, b) => {
      const [yearA, monthA] = a.split('/');
      const [yearB, monthB] = b.split('/');
      return yearA === yearB
        ? parseInt(monthA) - parseInt(monthB)
        : parseInt(yearA) - parseInt(yearB);
    })
    .reduce((sorted, key) => {
      sorted[key] = data[key];
      return sorted;
    }, {});
};

const getTourRevenueService = async () => {
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

  const bookingsPerMonth = {};
  const customersPerMonth = {};
  const revenuesPerMonth = {};

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

  return {
    totalBookings,
    totalCustomers,
    totalRevenues,
    bookingsPerMonth: sortMonthlyData(bookingsPerMonth),
    customersPerMonth: sortMonthlyData(customersPerMonth),
    revenuesPerMonth: sortMonthlyData(revenuesPerMonth),
  };
};

module.exports = {
  buildTourFilter,
  getToursWithPaginationService,
  getTourDetailsWithBookingsService,
  getTourRevenueService,
  tourTypeMap,
  bookingStatusMap,
};
