require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const initRoutes = require("./src/routes");
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
