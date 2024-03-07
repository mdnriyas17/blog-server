const mongoose = require("mongoose");

var products = new mongoose.Schema(
  {
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"mastersettings",
      default:null,
      required:true,
    },
    category_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref:"mastersettings",
      // default:null,
      required:true,
    },
    brand_name: {
      type: String,
      trim: true,
      ref:"product"
    },
    category_name: {
      type: String,
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
      // default:null,
      required:true,
    },
    image: {
      type:[String],
      default:null,
      required:true,
    },
    tax_persentage:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"tax",
      // required:true,
    },
    default_margin:{
      type:Number,
      // required:true,
    },

    sub_name: {
      type: String,
      trim: true,
    },
    // sku:{
    //   type:String,
    //   unique:true,
    //   trim:true,
    //   required:true,
    // },

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
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("products", products);
// box_quantity:[
    //   {
    //     kg:{
    //       type:Number,
    //       required:true,
    //     },
    //     avalible_box:{
    //       type:String,
    //       required:true, 
    //     },
    //   }
    // ],

       // mrp:{
    //   type:Number,
    //   trim:true,
    //   required:true,
    // }, 
    // sp: {
    //   type:Number,
    //   trim:true,
    //   required:true,
    // },
    // avalible_box:{
    //   type:Number,
    //   required:true,
    // },