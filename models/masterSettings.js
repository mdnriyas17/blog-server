const mongoose = require("mongoose");

var masterSettings = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"mastersettings",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"mastersettings",
    },
    description: {
      type: String,
      // default:null,
    },
    image: {
      type:[String],
      default:null,
      required:true,
    },
    mode: {
      type: String,
      required: true,
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
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("mastersettings", masterSettings);
