const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var dailypricedetails = new mongoose.Schema(
  {
    product_name: {
      type: String,
      ref:"product",//name from products
      required: true,
      trim: true,
      unique: true
    },
    product_details:[{
      brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"product",
        default:null,
        required:true,
      },
      category_id: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"product",
        default:null,
        required:true,
      },
      brand_name: {
        type: String,
        // required: true,
        trim: true,
        ref:"product"
      },
      category_name: {
        type: String,
        // required: true,
        trim: true,
        ref:"product"
      },
      name: {
        type: String,
        unique:true,
        trim:true,
        required:true,
      },
      description: {
        type: String,
        default:null,
        required:true,
      },
      image: {
        type:[String],
        default:null
      },
      tax_persentage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tax",
        required:true,
      },
      default_margin:{
        type:Number,
        required:true,
      },
      sku:{
        type:String,
        unique:true,
      },
      status: {
        type:Boolean,
        default:true,
      },
      done_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'admins',
      },
      created_date_time: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
    ],
price_details:[
  {
    todays_price:{
      type: Number,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    date:{
      type: String,
      required: true,
    },

    status:{
      type:Boolean,
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
  
  },
]
  });

module.exports = mongoose.model("dailyprice", dailypricedetails);
