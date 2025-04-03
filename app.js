require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const adminRouter = require("./src/routes/admin");

var app = express();

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Đặt layout mặc định cho tất cả các trang
app.set("layout", "admin/components/common");

// Cho phép bỏ qua layout ở một số trang nhất định
app.use((req, res, next) => {
  res.locals.noLayout = false;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
