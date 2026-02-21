const mongoose = require("mongoose");

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

module.exports = mongoose.model("Account", accountSchema);
