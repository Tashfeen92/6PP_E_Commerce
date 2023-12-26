const mongoose = require("mongoose");

const connectDatabase = () => {
  const DATABASE = process.env.DATABASE;
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true,
    })
    .then((data) => {
      console.log(`MongoDB Connected with host: ${data.connection.host}`);
    });
};

module.exports = { connectDatabase };
