// Imports
const app = require("./app.js");
// const dotenv = require("dotenv"); // config - (Use if Condition for Hosting Purposes - Check the Config Below)
const cloudinary = require("cloudinary");
const { connectDatabase } = require("./database/database.js");

// Uncaught Exception Handling - Using Process.on Event
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting Down the Server Due to Unhandled Promise Rejection`);
  process.exit(1); // Exit Node.js Application
});

// config - (Use if Condition for Hosting Purposes)
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "./Server/config/config.env" });

// Connection to Database
connectDatabase();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server
const PORT = process.env.PORT;
const server = app.listen(PORT, (req, res) => {
  console.log(`Server is Working on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection - Using Process.on Event
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting Down the Server Due to Unhandled Promise Rejection`);
  server.close(() => {
    // Closing Our Server
    process.exit(1); // Exit Node.js Application
  });
});
