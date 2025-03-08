const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    profile: {
      name: {
        type: String,
        trim: true,
        required: [true, "Please provide a name"],
      },
      age: {
        type: Number,
        required: [true, "Please provide an age"],
      },
      profilePic: {
        type: String,
        default: "",
      },
    },
    refreshToken: { type: String },
    cycleLength: {
      type: Number,
      default: 28,
      min: [21, "Cycle length must be at least 21 days"],
      max: [35, "Cycle length must be at most 35 days"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  let saltRound = 10;

  try {
    const salt = await bcryptjs.genSalt(saltRound);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
