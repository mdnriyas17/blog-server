const mongoose = require("mongoose");

var delivery = new mongoose.Schema(
  {
    company_code: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    Weight: {
      type: String,
    },
    Local: {
      type: String,
      required: true,
    },
    Upto200Kms: {
      type: String,
      required: true,
    },
    Kms201_1000: {
      type: String,
      required: true,
    },
    Kms1001_2000: {
      type: String,
      required: true,
    },
    Above2000Kms: {
      type: String,
      required: true,
    },
    VolumeEnd: {
      type: String,
      required: true,
    },
    VolumeStart: {
      type: String,
      required: true,
    },
    done_by: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
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

module.exports = mongoose.model("delivery", delivery);
