const mongoose = require("mongoose");
const orderlog = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
    order_status: { type: String,enum: [
      "Pending",
      "Packing",
      "Billed",
      "Dispatched",
      "Delivered",
      "Cancel",
      "refund",
      "reject",
      "return",
    ], },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
    status_date:{
      type: Date,
      default: Date.now(),
    },
    created_date_time:
    {
      type: Date,
      default: Date.now(),
    },
    // status_date: { type: Date,   default: () => new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
    // message: { type: String },
    // status: { type: Boolean, default: true },
    // done_by: { type: mongoose.Schema.Types.ObjectId },
    // created_at: { type: Date,    default: () => new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("orderlogs", orderlog);
