const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var staffs = new mongoose.Schema(
  {
    display_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 15,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    role: {
      type: String,
      required: true,
      default: "staff",
      enum: ["staff"],
    },
    done_by: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("staffs", staffs);
