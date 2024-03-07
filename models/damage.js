const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var damage = new mongoose.Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    spec_id: String,
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



module.exports = mongoose.model("damage", damage);
