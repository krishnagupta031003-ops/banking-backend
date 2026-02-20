
const env = require("./env");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Db got connected");
  } catch (err) {
    console.log("DB connection error");
    console.log(err.message);
    process.exit(1);      
  }
};

module.exports= connectDB