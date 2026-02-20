const dotenv = require("dotenv");
dotenv.config();

const { PORT,JWT_SECRET, MONGO_URI } = process.env;

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET

};
