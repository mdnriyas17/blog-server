const mongoose = require("mongoose");

const adminreports = new mongoose.Schema(
  {
    bill_no: {
      type: Number,
    },
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bill",
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order", 
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    damagereport_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "damages",
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type:String,
      required:true,
    },
    created_date_time: {
      type: Date,
      default: Date.now(),
    },
  },{
    timestamps: true,
    versionKey: false,
  }
)

module.exports = mongoose.model("adminreports", adminreports)