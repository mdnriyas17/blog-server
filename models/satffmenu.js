const mongoose = require("mongoose");
var adminmenus = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
    },
    menu_icon: {
      type: String,
    },
    menu_type: {
      type: String,
    },
    module: {
      type: String,
    },
    parent_id: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("staffmenu", staffmenu);
