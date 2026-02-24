const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "fromAccount, toAccount, status, amount, idempotencyKey is mandatory to create a transaction",
    });
  }
  try {
    const isExistFromAccount = await accountModel.findOne({ _id: fromAccount });
    const isExistToAccount = await accountModel.findOne({ _id: toAccount });

    if (!isExistFromAccount || !isExistToAccount) {
      return res.status(400).json({
        message: "no toAccount/fromAccount exists...",
      });
    }

    if (fromAccount === toAccount) {
      return res.status(401).json({
        message:
          "WRONG CREADENTIALS ,From account and To account can not be same...",
      });
    }


    const transaction = await transactionModel.create({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
    });
    if (!transaction) {
      return res.status(401).json({
        message:
          "WRONG CREADENTIALS ,please provide correct transaction details...",
      });
    }

    res.status(201).json({
      message: "transaction created successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = createTransaction;
