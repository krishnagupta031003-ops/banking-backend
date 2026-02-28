const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Erom account is mandatory in creating a ledger entry."],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is requird for creating a ledger entry."],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tansaction",
      required: [true, "Ledger must be associated with the transaction."],
    },
    transactionType: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Transaction type can be either CREDIT or DEBIT...",
      },
      required: [true, "Transaction type is requird for ledger entry"],
      default: "DEBIT",
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

function preventLedgerModification() {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted ",
  );
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneandReplace", preventLedgerModification);

module.exports = mongoose.model("LedgerEntry", ledgerSchema);

