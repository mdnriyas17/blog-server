const mongoose = require("mongoose");

var menus = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("menus", menus);
