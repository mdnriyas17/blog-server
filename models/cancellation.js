const mongoose = require("mongoose");

var cencellation = mongoose.model("cencellation", {
  page_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default:true,
  },
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
  }
})

exports = mongoose.model("cencellation", cencellation);