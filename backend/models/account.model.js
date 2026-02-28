const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "account must be associated with the user"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "frozen", "closed"],
        message: "status can be either active, frozen, closed",
      },
      default: "active",
    },
    currency: {
      type: String,
      required: [true, "currency is required for creating an account"],
      default: "INR",
    },
  },
  { timestamps: true },
);


accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$transactionType", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$transactionType", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },

    {
      $project: {
        balance: { $subtract: ["$totalCredit", "$totalDebit"] },
      },
    },
  ]);
  return balanceData[0]?.balance || 0;
};

module.exports = mongoose.model("Account", accountSchema);
