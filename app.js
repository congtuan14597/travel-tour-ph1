require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const adminRouter = require("./src/routes/admin");
const userRouter = require("./src/routes/user");

var app = express();

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Mặc định không sử dụng layout
  res.locals.noLayout = false;

  const adminToken = req.cookies.adminAccessToken;
  if (adminToken) {
    app.set("layout", "admin/components/common");
    return next();
  }

  const employeeToken = req.cookies.employeeAccessToken;
  const collaboratorToken = req.cookies.collaboratorAccessToken;
  if (employeeToken || collaboratorToken) {
    app.set("layout", "user/components/common");
    return next();
  }

  // Nếu không có token nào, sử dụng layout mặc định
  app.set("layout", "user/components/common");
  next();
});

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
