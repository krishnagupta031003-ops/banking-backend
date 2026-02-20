const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required for creating a user..."],
    },
    email: {
      type: String,
      required: [true, "Email is required for creating a user..."],
      unique: [true, "Email already exists"],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/

, "please use a valid email"],
      lowercase: true,
    },

    password: {
      type: String,
      minlength: [6, "Password should be of atleast 6 charecter "],
      required: [true, "Password is required for creating a user..."],
      select: false,
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
 

});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
  
}

module.exports = mongoose.model("User", userSchema);
