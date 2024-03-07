// const payment = require("../../models/paymentResponseLogs");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const order = require("../../models/order");
const orderlogs = require("../../models/orderLogs");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const payment = require("../../models/paymentInfo");
// get all 


const getallPayment = asyncHandler(async (req, res) => {
  try {
    let options = {};
    let createdAt;
    let products;
    let total;
    let filter;
    const queryObj = { ...req.query };
    const excludeFields = ["company_code", "startdate", "enddate", "min", "max", "products", "user"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
      const startDateTime = new Date(req?.query?.startdate);
      startDateTime.setHours(0, 0, 0, 0);

      createdAt = {
        $gte: startDateTime ,
        $lte: new Date(req?.query?.enddate)
      };

      filter = { ...queryObj, createdAt };
    } else {
      createdAt = {};
      filter = { ...queryObj };
    }

    if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
      total = {
        $gte: req?.query?.min,
        $lte: req?.query?.max
      };
      filter = { ...filter, total };
    }

    if (req?.query?.products && req?.query?.products !== '') {
      filter = { ...filter, "products.product": req?.query?.products };
    }

    if (req?.query?.user && req?.query?.user !== "") {
      filter = { ...filter, customer: req?.query?.user };
    }
    let obj = [];
    let all = await order.find(filter).sort({ createdAt: -1 }).populate("customer").populate({
      path: 'products.brand_id',
      model: 'mastersettings',
    }).populate({
      path: 'products.category_id',
      model: 'mastersettings',
    })
    const failure = await paymentResponseLogModel.find({ status: "failure" });

    for (let i = 0; i < all.length; i++) {
      const singleLog = await orderlogs.find({ order_id: all[i]._id });
      const payment = await paymentResponseLogModel.find({ txnid: all[i]?.payment_id});
  
      obj.push({
        order: all[i],
        invoice_date: (all[i].date),
        invoice_no: all[i]?.order_no,
        payment: payment,
  
      });
  
    }
    if (all) success(res, 200, true, "Get data successfully", obj);
  } catch (error) {
    throw new Error(error);
  }
})
// const getallPayment = asyncHandler(async (req, res) => {
  // try {
  //   const all = await paymentResponseLogModel.find();

  //   const orders = await order.find()

  //   const resi = await paymentResponseLogModel.aggregate([

  //     {
  //       $lookup: {
  //         from: "order",
  //         localField: "txnid",
  //         foreignField: "payment_id",
  //         as: "orders",
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         amount: 1,
  //         payment_id: 1,
  //         status: 1,
  //         email: 1,
  //         phone: 1,
  //         name: 1,
  //         date: 1,
  //         txnid: 1,
  //         status: 1,
  //         orders: 1,
  //       },
  //     }
  //   ]);
  //   console.log(resi)
  //   if (all) success(res, 200, true, "Get data successfully", all);
  // }catch (error) {
  //   throw new Error(error);
  // }
  // try {
  //   let filter;
  //   const queryObj = { ...req.query };
  //   const excludeFields = ["company_code", "startdate", "enddate", "min", "max", "products", "user"];
  //   excludeFields.forEach((el) => delete queryObj[el]);

  //   if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
  //     filter = {
  //       ...queryObj,
  //       createdAt: {
  //         $gte: new Date(req?.query?.startdate).getDate() - 1,
  //         $lte: new Date(req?.query?.enddate),
  //       },
  //     };
  //   } else {
  //     filter = { ...queryObj };
  //   }

  //   if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
  //     filter.total = {
  //       $gte: req?.query?.min,
  //       $lte: req?.query?.max,
  //     };
  //   }

  //   if (req?.query?.products && req?.query?.products !== "") {
  //     filter["products.product"] = req?.query?.products;
  //   }

  //   if (req?.query?.user && req?.query?.user !== "") {
  //     filter.customer = req?.query?.user;
  //   }

  //   let obj = [];
  //   let all = await order.find(filter).sort({ createdAt: -1 })
   

  //   for (let i = 0; i < all.length; i++) {
  //     const payment = await paymentResponseLogModel.find({txnid: all[i]?.payment_id , status: "success" });
  //     const failure = await paymentResponseLogModel.find({ status: "failure" });
  //     obj.push({
  //       order: all[i],
  //       invoice_date: (all[i].date),
  //       invoice_no: all[i]?.order_no + 1,
  //       payment,
  //       failure
  //     });
  //   }
  //   if (all) success(res, 200, true, "Get data successfully", obj);
  // } catch (error) {
  //   throw new Error(error);
  // }
// });

//only for EaseBuzz only 

const getallPaymentEase = asyncHandler(async (req, res) => {
  try {
    let options = {};
    let createdAt;
    let products;
    let total;
    let filter;
    const queryObj = { ...req.query };
    const excludeFields = ["company_code", "startdate", "enddate", "min", "max", "products", "user"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
      const startDateTime = new Date(req?.query?.startdate);
      startDateTime.setHours(0, 0, 0, 0);

      createdAt = {
        $gte: startDateTime ,
        $lte: new Date(req?.query?.enddate)
      };

      filter = { ...queryObj, createdAt };
    } else {
      createdAt = {};
      filter = { ...queryObj };
    }

    if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
      total = {
        $gte: req?.query?.min,
        $lte: req?.query?.max
      };
      filter = { ...filter, total };
    }

    if (req?.query?.products && req?.query?.products !== '') {
      filter = { ...filter, "products.product": req?.query?.products };
    }

    if (req?.query?.user && req?.query?.user !== "") {
      filter = { ...filter, customer: req?.query?.user };
    }
    const all = await payment.find(filter).populate({
      path:"customer",
      model:"customer",
    }).sort({createdAt:-1});
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
  getallPayment,
  getallPaymentEase
}