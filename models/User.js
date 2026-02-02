const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * USER SCHEMA
 */
const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔒 never return password by default
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔐 HASH PASSWORD BEFORE SAVING USER
 */
UserSchema.pre("save", async function (next) {
  try {
    // Only hash if password was modified or is new
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 🔑 COMPARE PASSWORD DURING LOGIN
 */
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * EXPORT MODEL
 */
module.exports = mongoose.model("User", UserSchema);

