const mongoose = require("mongoose");
const accountModel = require("../models/account.model");

exports.createAccount = async (req, res) => {
  const user_id = req.user.id;
  const { currency, status } = req.body;
  try {
    

    const account = await accountModel.create({
      user_id,
      currency,
      status,
    });

    res.status(201).json({
      message: "account created successfully",
     
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.fetchAccount = async (req, res) => {
  const user_id = req.user.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        message: "Invalid accountId",
      });
    }
    const fetchedAccount = await accountModel.findById(user_id);
    if (!fetchedAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    res.status(200).json({
      message: "account found succesfully",
      fetchedAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
