// const bill = require("../../models/bill");
const damage = require("../../models/damages");
const validateId = require("../../utils/validateId");
const adminreport = require("../../models/adminreports");
const order = require("../../models/order");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const customer = require("../../models/customer");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
//getall

// const getBillAndAdminReportData = asyncHandler(async (req, res) => {
//   try {

//     const result = await damage.aggregate([
//       {
//         $sort: {
//           createdAt: -1
//         }
//       },
//       {
//         $lookup: {
//           from: "adminreports",
//           localField: "_id",
//           foreignField: "bill_id",
//           as: "adminreport",
//         },
//       },

//     ]);
//     const orderIds = result.map((item) => item.order_id);
//     // console.log(orderIds)
//     const populatedResult = await order.find({ _id: { $in: orderIds } }).populate("customer")
//     // console.log(populatedResult)
//     const combinedResult = result.map((item) => {
//       const orderDetails = populatedResult.find((orderItem) =>
//         orderItem._id.equals(item.order_id)
//       );
//       return {


        
//         orderDetails,
//         ...item,
//       };
//     });
//     if (combinedResult) {
//       success(res, 200, true, "Get data successfully", combinedResult);
//     }
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching data');
//   }
// });
const getBillAndAdminReportData = asyncHandler(async (req, res) => {
  try {
    let options = {};
    let updatedAt;
    let total;
    let filter = {};
    const queryObj = { ...req.query };
    const excludeFields = ["company_code", "startdate", "enddate", "min", "max", "products", "user"];
    excludeFields.forEach((el) => delete queryObj[el]);
    
    if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
      const startDateTime = new Date(req?.query?.startdate);
      startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(req?.query?.enddate);
    endDateTime.setHours(0, 0, 0, 0);
      updatedAt = {
        $gte: startDateTime ,
        $lte: endDateTime,
      };
    
      filter = { ...queryObj, updatedAt };
    } else {
      updatedAt = {};
      filter = { ...queryObj };
    }
    
    if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
      total = {
        $gte: req?.query?.min,
        $lte: req?.query?.max,
      };
      filter = { ...filter, total };
    }
    
    if (req?.query?.products && req?.query?.products !== '') {
      filter = { ...filter, "products.product": req?.query?.products };
    }
    
    if (req?.query?.user && req?.query?.user !== "") {
      filter["customer_id"] = new ObjectId(req?.query?.user); // Assuming user is the customer ID
    }
   

    const result = await damage.aggregate([
      {
        $match: filter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "adminreports",
          localField: "_id",
          foreignField: "bill_id",
          as: "adminreport",
        },
      },
    ]);
    const orderIds = result.map((item) => item.order_id);
    const populatedResult = await order.find({ _id: { $in: orderIds } }).populate({
      path: 'customer',
      model: 'customer',
    }).populate([
      {
        path: 'products.category_id',
        model: 'mastersettings',
      },
      {
        path: 'products.brand_id',
        model: 'mastersettings',
      }

    ]);

    const combinedResult = result.map((item) => {
      const orderDetails = populatedResult.find((orderItem) => orderItem._id.equals(item.order_id));
      return {
        orderDetails,
        ...item,
      };
    });
    if (combinedResult) {
      success(res, 200, true, "Get data successfully", combinedResult);
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error fetching data');
  } 
});






// const getBillAndAdminReportDataById = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//   validateId(id);
//     const result = await damage.aggregate([
//       {
//         $match: {
//           _id: id,
//         },
//       },
//       {
//         $lookup: {
//           from: "adminreports",
//           localField: "_id",
//           foreignField: "bill_id",
//           as: "adminreport",
//         },
//       },
//     ]);

//     if (result.length > 0) {
//       const orderDetails = await order.findById(result[0].order_id).populate("customer");
//       const combinedResult = {
//         orderDetails,
//         ...result[0],
//       }; 

//       success(res, 200, true, "Get data successfully", combinedResult);
//     } 
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching data');
//   }
// });
const getBillAndAdminReportDataById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);

    const result = await damage.aggregate([
      {
        $match: {
          order_id: id,
        },
      },
      {
        $lookup: {
          from: "adminreports",
          localField: "_id",
          foreignField: "bill_id",
          as: "adminreport",
        },
      },
    ]);

    if (result.length > 0) {
      const orderDetails = await order.findById(result[0].order_id).populate("customer");
      const combinedResult = {
        orderDetails,
        ...result[0],
      };

      success(res, 200, true, "Get data successfully", combinedResult);
    } 
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data');
  }
});


  

module.exports = {
  getBillAndAdminReportData,
  getBillAndAdminReportDataById
}