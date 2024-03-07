const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var masterUser = new mongoose.Schema(
  {
    user_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    contact_number: {
      type: Number,
      required: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    mode_of_operation: {
      type: String,
      required: true,
      enum: ["individual", "company"],
    },
    pan_number: {
      type: String,
      required: true,
      trim: true,
    },
    contact_address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    role: {
      type: String,
      required:true,
      enum: ["admin","superadmin","master"],
      default: "admin",
    },
    created_date_time: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

masterUser.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

masterUser.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
}



module.exports = mongoose.model("masteruser", masterUser);
