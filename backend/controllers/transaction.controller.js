const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerEntryModel = require("../models/ledger.model");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "fromAccount, toAccount, status, amount, idempotencyKey is mandatory to create a transaction",
    });
  }
  let session;
  try {
    const isExistFromAccount = await accountModel.findOne({ _id: fromAccount });
    const isExistToAccount = await accountModel.findOne({ _id: toAccount });

    if (!isExistFromAccount || !isExistToAccount) {
      return res
        .status(400)

        .json({
          message: "no toAccount/fromAccount exists...",
        });
    }

    if (fromAccount === toAccount) {
      return res.status(401).json({
        message:
          "WRONG CREADENTIALS ,From account and To account can not be same...",
      });
    }
    //validate idempotency key

    const isTtransacionAlreadyExist = await transactionModel.findOne({
      idempotencyKey,
    });

    if (isTtransacionAlreadyExist) {
      if (isTtransacionAlreadyExist.status === "COMPLETED") {
        return res.status(200).json({
          message: "Transaction already processed...",
        });
      }

      if (isTtransacionAlreadyExist.status === "PENDING") {
        return res.status(200).json({
          message: "Transaction still processing...",
        });
      }

      if (isTtransacionAlreadyExist.status === "FAILED") {
        return res.status(500).json({
          message: "Transaction failed previously, please retry...",
        });
      }
      if (isTtransacionAlreadyExist.status === "REVERSED") {
        return res.status(500).json({
          message: "Transaction reversed , please retey...",
        });
      }
    }

    //checking account status

    if (
      isExistFromAccount.status !== "active" ||
      isExistToAccount.status !== "active"
    ) {
      return res.status(400).json({
        message: "your to account or from account is not active...",
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const balance = await isExistFromAccount.getBalance({ session });

    if (balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Insufficint balance in your account. Current balance is ${balance}. Requested balance is ${amount}`,
      });
    }

    const transaction = await transactionModel.create(
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
      },
      { session },
    );

    if (!transaction) {
      session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        message:
          "WRONG CREADENTIALS ,please provide correct transaction details...",
      });
    }

    const debitLedger = await ledgerEntryModel.create(
      {
        account: fromAccount,
        amount,
        transactionType: "DEBIT",
        transaction: transaction._id,
      },
      { session },
    );

    const creditLedger = await ledgerEntryModel.create(
      {
        account: toAccount,
        amount,
        transactionType: "CREDIT",
        transaction: transaction._id,
      },
      { session },
    );

    const updateTransaction = await transactionModel.updateOne(
      { _id: transaction._id },
      {
        $set: {
          status: "COMPLETED",
        },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "transaction created successfully..",
      transaction,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = createTransaction;
