const mongoose = require("mongoose");

var refund = new mongoose.Schema({
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
  createdAt:{
    type:Date,
    default: Date.now(),
    required: true,
  },
  updatedAt:{
    type:Date,
    required: true,
    default: Date.now()
  },
})

exports = mongoose.model("refund", refund);