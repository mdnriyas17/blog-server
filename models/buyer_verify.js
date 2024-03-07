const mongoose = require("mongoose");
let Schema = mongoose.Schema;

var buyer_verify = new mongoose.Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    mobile_number:Number,
    code:Number,
    smscode:String,
    status: {
      type: String,
      default:'o',
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



module.exports = mongoose.model("buyer_verify", buyer_verify);
