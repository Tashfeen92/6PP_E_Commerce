// Imports
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv"); // config - (Use if Condition for Hosting Purposes - Check the Config Below)
// const path = require("path"); //Just For Hosting

const { errorMiddleware } = require("./middlewares/errorMiddleware.js");

// config - (Use if Condition for Hosting Purposes)
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "./Server/config/config.env" });

// MiddleWares
app.use(express.json()); // Converts data from json to Object format As our application does not understand json.
app.use(cookieParser()); // (Get)Parse Cookie
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Allows us to run server on single host(on backend host) after creating build for Client Folder(npm run build)
// app.use(express.static(path.join(__dirname, "../Client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../Client/build/index.html"));
// });

// Route Imports
const product = require("./routes/productRoutes.js"); // Product Routes
const user = require("./routes/userRoutes.js"); // User Routes
const order = require("./routes/orderRoutes.js"); // Order Routes
const payment = require("./routes/paymentRoutes.js"); // Payment Routes

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
