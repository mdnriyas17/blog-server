const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var damages = new mongoose.Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    spec_id: {
      type: Schema.Types.ObjectId,
      ref: "productiondetails",
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },
    damage_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "damagetype",
    },
    damage_message: String,
    images: String,
    damagestatus:{
      type:String,
      enum:['return','reject',"refund"],
    },
    admin_damage_status:{
      type:String,
      enum:['return','reject',"refund"],
    },
    admin_damage_message:{
      type:String,
    },
    admin_status:{
      type:Boolean,
      default:false,
    },
    status: {
      type: Boolean,
      default:true,
    },
    status_date:{
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



module.exports = mongoose.model("damages", damages);
