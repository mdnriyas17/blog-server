const mongoose = require("mongoose");

var pages = new mongoose.Schema(
  {
    pagename: {
      type: String,
      required: true,
      unique: true,
    },
    pagetype: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
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

module.exports = mongoose.model("pages", pages);
