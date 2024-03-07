const mongoose = require("mongoose");

var marginprice = new mongoose.Schema({
  product_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'products',
  },
  mrp:{
    type:Number,
  },
  sp:{
    type:Number,
  },
  created_date_time:{
    type:Date,
    default:Date.now(),
  },
  done_by:{
    type:mongoose.Schema.Types.ObjectId,
  }
});

module.exports = mongoose.model("marginprice", marginprice);