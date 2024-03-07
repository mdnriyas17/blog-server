const mongoose = require("mongoose");

let paymentInfo = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    item: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        productspec_id: { type: mongoose.Schema.Types.ObjectId },
        product_name: String,
        brand_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "mastersettings",
        },
        category_id:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "mastersettings",
        }],
        description: String,
        sku: String,
        product_image:[String],
        kg: { type: Number, required: true},
        mrp:{type:Number},
        sp: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
        tax: { type: Number},
        default_margin: { type: Number },
        tax_persentage: { type: Number },
        total: { type: Number }
      },
    ],
    tax: Number,
    delivery_charge: Number,
    amount: Number,
    name: String,
    mobile_number: Number,
    email_id: String,
    easepayid: String,
    status: String,
    cancellation_reason: String,
    error_Message: String,
    key: String,
    response: String,
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
    status_date:{
      type: Date,
      default: Date.now(),
    },
    created_date_time:
    {
      type: Date,
      default: Date.now(),
    }
  },
  
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("paymentinfo", paymentInfo);
