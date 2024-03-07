const bill = require("../../models/bill");
const payment = require("../../models/paymentResponseLogs");
const damage = require("../../models/damages");
const adminreport = require("../../models/adminreports");
const order = require("../../models/order");
const orderlogs = require("../../models/orderLogs");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const customer = require("../../models/customer");
const objectId = require("mongoose").Types.ObjectId;
//getall

const customerSummery = asyncHandler(async (req, res) => {
  try {
    const data = [];
    let filter;
    const queryObj = { ...req.query };
    const excludeFields = ["company_code", "startdate", "enddate", "user", "mobile_number"];
    
    excludeFields.forEach((el) => delete queryObj[el]);

    const damageFilter = { ...queryObj };
    const orderFilter = { ...queryObj };
    const billFilter = { ...queryObj };

    if (
      req?.query?.startdate &&
      req?.query?.enddate &&
      req?.query?.startdate !== "" &&
      req?.query?.enddate !== ""
    ) {
      const startDateTime = new Date(req?.query?.startdate);
      startDateTime.setHours(0, 0, 0, 0);
      const endDateTime = new Date(req?.query?.enddate);
      endDateTime.setHours(23, 59, 59, 999);
      damageFilter.createdAt = {
        $gte: startDateTime,
        $lte: endDateTime,
      };
      orderFilter.createdAt = damageFilter.createdAt;
      billFilter.createdAt = damageFilter.createdAt;
    }

    if (req?.query?.user && req?.query?.user !== "") {
      (damageFilter.customer_id = new objectId(req.query.user)),
        (orderFilter.customer = req?.query?.user);
      billFilter.customer = req?.query?.user;
    }

    if (req?.query?.mobile_number && req?.query?.mobile_number !== "") {
      const mobileNumber = parseInt(req.query.mobile_number); // Convert to number
      damageFilter['delivery_address.mobile_no'] = mobileNumber;
        orderFilter['delivery_address.mobile_no'] = mobileNumber;
        billFilter['delivery_address.mobile_no'] = mobileNumber;
    }

    // console.log("Damage Filter:", damageFilter);
    // console.log("Order Filter:", orderFilter);
    // console.log("Bill Filter:", billFilter);

    const result = await damage.aggregate([
      {
        $match: damageFilter,
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
    const populatedResult = await order
      .find({ _id: { $in: orderIds } })
      .populate("customer");

    const combinedResult = result.map((item) => {
      const orderDetails = populatedResult.find((orderItem) =>
        orderItem._id.equals(item.order_id)
      );
      return {
        orderDetails,
        ...item,
      };
    });
    // console.log("Combined Result:", combinedResult);
    // console.log("Combined Result:", combinedResult.map((item) => item.orderDetails.customer.mobile_number));
      const bills = await bill.find(billFilter).populate({
      path: "customer",
      model: "customer",
    });

    let obj = [];
    let all = await order
      .find(orderFilter)
      .populate("customer")
      .populate({
        path: "products.brand_id",
        model: "mastersettings",
      })
      .populate({
        path: "products.category_id",
        model: "mastersettings",
      });
    for (let i = 0; i < all.length; i++) {
      const singleLog = await orderlogs.find({ order_id: all[i]._id });
      const payment = await paymentResponseLogModel.find({
        txnid: all[i]?.payment_id,
      });
      obj.push({
        order: all[i],
        invoice_date: all[i].date,
        invoice_no: all[i]?.order_no,
        orderstatus: singleLog,
        payment: payment,
      });
    }
    // console.log(obj);
    // console.log(obj.map((item) => item.order.customer.mobile_number));
      obj.forEach((item) => {
        data.push(item);
      });
    bills.forEach((item) => {
      data.push(item);
    });

      const datada = await damage
        .find(damageFilter) 
      .find(damageFilter) 
        .find(damageFilter) 
        .populate("order_id customer_id damage_type");
    datada.forEach((item) => {
      data.push(item);
    });
    combinedResult.forEach((item) => {
      data.push(item); 
    });

    if (data) {
      success(res, 200, true, "Get data successfully", data);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data");
  }
});

module.exports = {
  customerSummery,
};
