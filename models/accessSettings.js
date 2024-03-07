const mongoose = require("mongoose");

var accessSettings = new mongoose.Schema(
  {
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
      required: true,
      unique:true,
    },
    AccessSettings:{
      type:[String],
      enum:['edit','view']
    },
    Company:{
      type:[String],
      enum:['edit','view']
    },
    Pages:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    Staff:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    BuyerList:{
      type:[String],
      enum:['edit','view','delete']
    },
    Brand:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    Category:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    Products:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    Tax:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    OrderBilled:{
      type:[String],
      enum:['view','download']  
    },
    OrderDispatch:{
      type:[String],
      enum:['view','download']
    },
    OrderDelivery:{
      type:[String],
      enum:['view','download']  
    },
    OrderPending:{
      type:[String],
      enum:['view','download']
    },
    OrderPacking:{
      type:[String],
      enum:['view','download']
    },
    OrderCancel:{
      type:[String],
      enum:['view','download']
    },
    DailyPriceDetails:{
      type:[String],
      enum:['edit','view']
    },
    ProductionDetails:{
      type:[String],
      enum:['edit','view']
    },
    DamageType:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    DamageReport:{
      type:[String],
      enum:['view']
    },
    BillInfo:{
      type:[String],
      enum:["view","add","edit","delete"]
    },
    Payment:{
      type:[String],
      enum:["view","add"]
    },
    MobileMenu:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    DeliveryCharge:{
      type:[String],
      enum:['add','edit','view','delete']
    },
    Billing:{
      type:[String],
      enum:['view','download']
    },
    Paymentsettings:{
      type:[String],
      enum:['view','download']
    },
    Returnsettings:{
      type:[String],
      enum:['view','download']
    },
    Refundpayment:{
      type:[String],
      enum:['view','download']
    },
    Customersummery:{
      type:[String],
      enum:['view','download']
    },
    Easebuzzpaymentstatus:{
      type:[String],
      enum:['view','download']
    },
    // access_permission:[
    //   {
    //     module:String,
    //     main:Boolean,
    //     options:{
    //       type:[String],
    //       options:['add','edit','view','delete']
    //     },
    //   },
    // ],
    done_by: {
      type: String,
    },
    created_date_time:  {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("accesssettings", accessSettings);