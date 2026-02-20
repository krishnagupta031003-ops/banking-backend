const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes")
const connectDB = require("./config/db");


connectDB();

app.use(express.json()); 



app.use("/api/auth", authRoutes);
app.use("api/account",accountRoutes)

module.exports = app;
