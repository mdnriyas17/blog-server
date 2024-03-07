const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");
const morgon = require("morgan");
const cors = require("cors");
process.env.TZ = "Asia/Kolkata";
const path = require("path");
//init function
const { initAdmin } = require("./controller/admin/initFunction");
initAdmin();
// adding
app.use(
  "/public/uploads/",
  express.static(path.join(__dirname, "public/uploads"))
);
app.use(
  "/public/videos/",
  express.static(path.join(__dirname, "public/videos"))
);
app.use(
  "/public/qrcode/",
  express.static(path.join(__dirname, "public/qrcode"))
);
//DataBase Connection
dbConnect();
app.use(morgon("dev"));
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Admin Routes
const adminRoute = "/api/v1/admin/";
const mobileRoute = "/api/v1/mobile/";
const admin = require("./routes/admin");
const mobile = require("./routes/mobile");
app.use(adminRoute, require("./routes/admin"));
app.use(adminRoute, require("./routes/mobile"));
app.use(mobileRoute, mobile);
app.use(adminRoute, admin);

//Post
const arr = [];
app.post("/", (req, res) => {
  arr.push(req.body);
  res.send(arr);
});

//Error Handler
app.use(notFound);
app.use(errorHandler);

//Create Server
app.listen(PORT, () => {
  console.log(`Server is running at post ${PORT}`);
});
