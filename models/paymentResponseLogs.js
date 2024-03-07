const mongoose = require("mongoose");
const paymentResponseLogSchema = mongoose.Schema(
  {
    txnid: String,
    firstname: String,
    email: String,
    phone: String,
    key: String,
    mode: String,
    status: String,
    unmappedstatus: String,
    cardCategory: String,
    addedon: Date,
    payment_source: String,
    PG_TYPE: String,
    bank_ref_num: String,
    bankcode: String,
    error: String,
    name_on_card: String,
    cardnum: String,
    issuing_bank: String,
    card_type: String,
    easepayid: String,
    amount: Number,
    net_amount_debit: Number,
    cash_back_percentage: Number,
    deduction_percentage: String,
    productinfo: String,
    tax: Number,
    udf1: String,
    udf2: String,
    udf3: String,
    udf4: String,
    udf5: String,
    udf6: String,
    udf7: String,
    udf8: String,
    udf9: String,
    udf10: String,
    hash: String,
    surl: String,
    furl: String,
    error_Message: String,
    merchant_logo: String,
    upi_va: String,
    bank_name: String,
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

module.exports = mongoose.model(
  "paymentResponseLogSchema",
  paymentResponseLogSchema
);
