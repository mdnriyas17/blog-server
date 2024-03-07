const mongoose = require("mongoose");

const reports = new mongoose.Schema(
  {
    bill_no: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    created_date_time: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },{
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("reports", reports)