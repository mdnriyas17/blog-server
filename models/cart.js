const mongoose = require("mongoose");

var carts = new mongoose.Schema(
  {
    customer_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'customer',
      required:true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'products',
      required: true,
    },
    productspec_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'products',
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default:1,
    },
    delivery_charge:{
      type:Number,
      default:0,//old one is null
    },
    status: {
      type:Boolean,
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
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("carts", carts);
