const mongoose = require("mongoose");
const { applyTimestamps } = require("./account.model");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      required: [true, "Transaction must be associated with a from account"],
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      required: [true, "Transaction must be associated with a to account"],
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message:
          "status can be either PENDING, COMPLETED, FAILED, REVERSED... ",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "entering transaction amount is mandatory..."],
      min: [0, "Tranction ammount cannot be negative."],
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency key is required for creating a transation.",
      ],
      unique: true,
      index: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
