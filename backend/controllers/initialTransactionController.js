const mongoose = require("mongoose");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

const intialLeadgerEntry = async (req, res) => {
  const { toAccount, amount, idempotencyKey } = req.body;
  let session;
  try {
    const toAccountExist = await accountModel.findOne({
      _id: toAccount,
    });

    if (!toAccountExist) {
      return res.status(400).json({
        message: "invalid toAccount..",
      });
    }

    const fromAccountExist = await accountModel.findOne({
      user: req.user._id,
    });

    if (!fromAccountExist) {
      return res.status(400).json({
        message: "no such system user account exists..",
      });
    }

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
      fromAccountExist.status !== "active" ||
      toAccountExist.status !== "active"
    ) {
      return res.status(400).json({
        message: "your to account or from account is not active...",
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();
   

    // const checkFromAccountBalance = await fromAccountExist.getBalance({
    //   session,
    // });

    // if (checkFromAccountBalance < amount) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   return res.status(400).json({
    //     message: `Insufficint balance in your account. Current balance is ${checkFromAccountBalance}. Requested balance is ${amount}`,
    //   });
    // }

    const initialBalanceTransactionEntry = new transactionModel({
      fromAccount: fromAccountExist._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    const initialDebitLedger = await ledgerModel.create(
      [
        {
          account: fromAccountExist._id,
          amount,
          transactionType: "DEBIT",
          transaction: initialBalanceTransactionEntry._id,
        },
      ],
      { session },
    );

    const initialBalanceLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transactionType: "CREDIT",
          transaction: initialBalanceTransactionEntry._id,
        },
      ],
      { session },
    );
     initialBalanceTransactionEntry.status = "COMPLETED";
    await initialBalanceTransactionEntry.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "initial fund transaction completed successfully..",
      transaction: initialBalanceTransactionEntry,
    });
  } catch (error) {
    console.log("ERROR:", error);
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = intialLeadgerEntry;
