const mongoose = require("mongoose");

var tax = new mongoose.Schema(
  {
    hsn_code: {
      type: String,
      required: true,
      unique:true,
    },
    tax_percentage: {
      type: Number,
      maxlength:5,
      required: true,
    },
    done_by: {
      type:mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: Boolean,
      required:true,
      default:true,
    },
    created_date_time: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("tax", tax);
