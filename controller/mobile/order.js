const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const order = require("../../models/order");

const orderlogs = require("../../models/orderLogs");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const adminreport = require("../../models/adminreports");
//getsingle 
const moment = require('moment-timezone');

// const getSingleOrder = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     validateId(id);
//     const check = await order.findOne({ _id: id });
//     if (!check) throw new Error("Data not found");

//     try {
//       let result = {};
//       const single = await order.findOne({ _id: id });
//       const singleLog = await orderlogs.find({ order_id: single?._id });
//       const payment = await paymentResponseLogModel.find({ txnid: single?.payment_id });
//       const adminreport = await adminreport.find({ bill_id: single?._id });
//       // Format date fields to Indian Standard Time
//       const formatToIST = (date) => {
//         return date ? moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY h:mm:ss a") : null;
//       };

//       if (single) {
//         result.order = {
//           ...single._doc,
//           date: formatToIST(single.date),
//           createdAt: formatToIST(single.createdAt),
//           updatedAt: formatToIST(single.updatedAt),
//         };
//       }

//       if (singleLog) {
//         result.orderlogs = singleLog.map((log) => ({
//           ...log._doc,
//           createdAt: formatToIST(log.createdAt),
//           updatedAt: formatToIST(log.updatedAt),
//         }));
//       }
//       result.adminreport = adminreport || "";
//       result.payment = payment || "";

//       if (single) success(res, 200, true, "Get data successfully", result);
//     } catch (error) {
//       throw new Error(error);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getSingleOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const check = await order.findOne({ _id: id });
    if (!check) throw new Error("Data not found");

    try {
      let result = {};
      const single = await order.findOne({ _id: id }).populate({
        path: "products.product",
        model: "products",
        populate: {
          path: "tax_persentage",
          model: "tax",
        },
      }).populate({
        path: "customer",
        model: "customer",
      });
      // .populate({
      //   path: "products.product",
      //   model: "products",
      //   populate: {
      //     path: "tax_persentage",
      //     model: "tax",
      //   },
      // });
      const singleLog = await orderlogs.find({ order_id: single?._id });
      const payment = await paymentResponseLogModel.find({ txnid: single?.payment_id });
      const adminreports = await adminreport.find({ bill_id: single?._id }); // Change variable name
      // Format date fields to Indian Standard Time
      const formatToIST = (date) => {
        return date ? moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY h:mm:ss a") : null;
      };

      if (single) {
        result.order = {
          ...single._doc,
          invoice_date: formatToIST(single.date), 
          invoice_no: single?.order_no,
          date: formatToIST(single.date),
          createdAt: formatToIST(single.createdAt),
          updatedAt: formatToIST(single.updatedAt),
        };
      }

      if (singleLog) {
        result.orderlogs = singleLog.map((log) => ({
          ...log._doc,
          createdAt: formatToIST(log.createdAt),
          updatedAt: formatToIST(log.updatedAt),
        }));
      }
      result.adminreports = adminreports || ""; // Change variable name
      result.payment = payment || "";

      if (single) success(res, 200, true, "Get data successfully", result);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  } 
});

//get all order
const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const single = await order.find({ customer: req.body.customer_id }).populate({
      path: "products.product",
      model: "products",
      populate: {
        path: "tax_persentage",
        model: "tax",
      },
    });
    let obj = [];

    for (let i = 0; i < single.length; i++) {
      const singleLog = await orderlogs.find({ order_id: single[i]._id });
      const payment = await paymentResponseLogModel.find({ txnid: single[i]?.payment_id });

      // Format date fields to Indian Standard Time
      const formatToIST = (date) => {
        return date ? moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY h:mm:ss a") : null;
      };

      obj.push({
        order: {
          ...single[i]._doc,
          invoice_date: formatToIST(single[i].date), // Push invoice_date to result.order
          invoice_no: single[i]?.order_no,
        date: formatToIST(single[i].date),
          createdAt: formatToIST(single[i].createdAt),
          updatedAt: formatToIST(single[i].updatedAt),
        },
        orderstatus: singleLog.map((log) => ({
          ...log._doc,
          
          createdAt: formatToIST(log.createdAt),
          updatedAt: formatToIST(log.updatedAt),
        })),
        payment,
      });
    }

    if (single) success(res, 200, true, "Get data successfully", obj);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getSingleOrder,
  getAllOrder
}
