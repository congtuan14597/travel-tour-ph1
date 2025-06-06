require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const user_authentication = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { User } = require("./models");
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

app.use(async (req, res, next) => {
  // Mặc định không sử dụng layout
  res.locals.noLayout = false;
  res.locals.user = null;

  const adminToken = req.cookies.adminAccessToken;
  if (adminToken) {
    app.set("layout", "admin/components/common");
    return next();
  }

  const employeeToken = req.cookies.employeeAccessToken;
  const collaboratorToken = req.cookies.collaboratorAccessToken;
  if (employeeToken || collaboratorToken) {
    try {
      const token = employeeToken || collaboratorToken;
      const decoded = user_authentication.verify(token, SECRET_KEY);
      const user = await User.findByPk(decoded.id);
      res.locals.user = user;
      app.set("layout", "user/components/common");
      return next();
    } catch (error) {
      res.clearCookie("employeeAccessToken", { path: "/" });
      res.clearCookie("collaboratorAccessToken", { path: "/" });
    }
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
