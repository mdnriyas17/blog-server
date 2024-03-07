const mongoose = require("mongoose");


var damagetype = new mongoose.Schema(
  {
    damage_type:{
      type:String,
      required:true
    },
    done_by: {
      type:mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: Boolean,
      required:true,
      default:true
    },
    created_date_time:{
      type:Date,
      default:Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);



module.exports = mongoose.model("damagetype", damagetype);
