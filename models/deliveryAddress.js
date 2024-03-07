const mongoose = require("mongoose");

var deliveryAddress = new mongoose.Schema(
  {
    customer_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'customers',
      required:true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    address_line1: {
      type: String,
      required: true,
    },
    address_line2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    landmark:String,
    pincode:{
      type:String,
      required:true,
    },
    alternate_no:Number,
    is_default_address:{
      type:Boolean,
      default:false,
    },
    status: {
      type:Boolean,
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

module.exports = mongoose.model("deliveryaddress", deliveryAddress);
