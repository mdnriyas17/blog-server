const mongoose = require("mongoose");

const company = new mongoose.Schema(
  {
    company_name: { type: String },
    admin_id: { type: mongoose.Schema.Types.ObjectId },
    gst_no: String,
    country: { type: String },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    area: String,
    pincode: Number,
    address_line1: String,
    address_line2: String,
    landline_no_1: String,
    landline_no_2: String,
    email: String,
    mobile_no: String,
    website: String,
    logo: String,
    pan_no:String,
    invoice_notes: String,
    invoice_title: String,
    invoice_text: [String],
    map: String,
    status: { type: Boolean, default: true },
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

module.exports = mongoose.model("company", company);
