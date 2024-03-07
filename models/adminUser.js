const mongoose = require("mongoose");


var adminuser = new mongoose.Schema(
  {
    name: {
      type:String,
      required:true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 15,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique:true,
      trim: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default:true,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum:['admin',"superadmin"],
    },
    created_date_time: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);




module.exports = mongoose.model("admin", adminuser);
