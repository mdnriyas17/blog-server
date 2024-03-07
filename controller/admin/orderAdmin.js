const order = require('../../models/order');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const orderlogs = require("../../models/orderLogs");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const bill = require("../../models/bill");
const {emailsender} = require("../../utils/email");

const setStatus = (val) => {
  try {
    switch (val) {
      case "Packing":
        return "Packing";
      case "Billed":
        return "Billed";
      case "Dispatched":
        return "Dispatched";
      case "Delivered":
        return "Delivered";
      case "Cancel":
        return "Cancel";
      case "Pending":
        return "Pending";
      default:
        throw new Error("Unable to find the status");
    }
  } catch (error) {
    throw new Error(error);
  }
}

//update
const updateOrderAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  setStatus(req?.body?.status);
  const form_data = {
    status:req?.body?.status,
  }
  
  const checkup = await order.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");


  try {
    const update = await order.findByIdAndUpdate(id, form_data, { new: true });
    if(req?.body?.status=="Billed") {
      let check_logs = await orderlogs.findOne({ order_id: id, order_status: "Billed" });
      if(check_logs) {
        throw new Error("Already Billed");
      } else {
        await createBillingInvoice(update);
      }
    }
    if(req?.body?.status=="Delivered") {
      await order.findOneAndUpdate(
        { _id: id },
        { $set: { "products.$[].qr_valid": final_val } },
        { new: true }
      );
    }
    await orderlogs.create({
      order_id: update?._id,
      order_status: update?.status
    });

    if (update) success(res, 200, true, "Update Successfully",update);
  } catch (error) {
    throw new Error(error);
  }
});

//updatemany
//update
const updateManyOrderAdmin = asyncHandler(async (req, res) => {
  const id = req?.body?.id;
  if(id.length<1) throw new Error('Please select Order!');
  const { status } = req.body;
  setStatus(status);
  let date = new Date();
  const daysToAdd = 3;
    function addDays(date, days) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
    
  try {
    for(i=0; i<id.length; i++) {
      let final_val = addDays(date, daysToAdd);
      let update = await order.findByIdAndUpdate(id[i], {status:status}, { new: true });
        if(update) {
          await orderlogs.create({
            order_id:update?._id,
            order_status:update?.status
          });
        }
        if(req?.body?.status=="Billed") {
          let check_logs = await orderlogs.find({ order_id: id[i], order_status: "Billed" });
          // console.log("check_logs.length",check_logs.length)
          if(check_logs.length<=1) {
            await createBillingInvoice(update);
          } else {
          }
        }
        if(req?.body?.status=="Delivered") {
          await order.findOneAndUpdate(
            { _id: id[i] },
            { $set: { "products.$[].qr_valid": final_val } },
            { new: true }
          );
        }
    }
    success(res,200,true,"Updated Successfully");
    
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleOrderAdmin = asyncHandler(async (req, res) => {
  try {
  const { id } = req.params;
  validateId(id);
  const check = await order.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    let result = {};
    const single = await order.findOne({ _id: id }).populate("customer").populate({
      path: "products.product",
      model: "products",
      populate: {
        path: "tax_persentage",
        model: "tax",
      },
    }).populate({
      path: "products.product",
      model: "products",
      populate: {
        path: "brand_id",
        model: "mastersettings",
      }
    }).
    populate({
      path: "products.product",
      model: "products",
      populate: {
        path: "category_id",
        model: "mastersettings",
      }
    })
    .exec();
      const singleLog = await orderlogs.find({ order_id: single?._id });
      const payment = await paymentResponseLogModel.find({ txnid: single?.payment_id});
      result.order = single;
      result.invoice_date = single.date, 
      result.invoice_no = single?.order_no ,
      result.orderlogs = singleLog || [];
      result.payment = payment || [];
      if (single) success(res, 200, true, "Get data successfully", result);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallOrderAdmin = asyncHandler(async (req, res) => {
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
    for (let i = 0; i < all.length; i++) {
      const singleLog = await orderlogs.find({ order_id: all[i]._id });
      const payment = await paymentResponseLogModel.find({ txnid: all[i]?.payment_id});
      obj.push({
        order: all[i],
        invoice_date: (all[i].date),
        invoice_no: all[i]?.order_no ,
        orderstatus:singleLog,
        payment: payment
      });
    }
    if (all) success(res, 200, true, "Get data successfully", obj);
  } catch (error) {
    throw new Error(error);
  }
});
// const getallOrderAdmin = asyncHandler(async (req, res) => {
//   try {
//     const filter = {};
//     const { startdate, enddate, min, max, products, user } = req.query;

//     if (startdate && enddate && startdate !== "" && enddate !== "") {
//       filter.createdAt = {
//         $gte: new Date(startdate).setHours(0, 0, 0, 0),
//         $lte: new Date(enddate),
//       };
//     }

//     if (min && max && min !== "" && max !== "") {
//       filter.total = {
//         $gte: min,
//         $lte: max,
//       };
//     }

//     if (products && products !== "") {
//       filter["products.product"] = products;
//     }

//     if (user && user !== "") {
//       filter.customer = user;
//     }

//     const obj = [];
//     const all = await order.find(filter).sort({ createdAt: -1 }).populate("customer").populate({
//       path: 'products.brand_id',
//       model: 'mastersettings',
//     }).populate({
//       path: 'products.category_id',
//       model: 'mastersettings',
//     });

//     for (let i = 0; i < all.length; i++) {
//       const singleLog = await orderlogs.find({ order_id: all[i]._id });
//       const payment = await paymentResponseLogModel.find({ txnid: all[i]?.payment_id });
//       obj.push({
//         order: all[i],
//         invoice_date: all[i].date,
//         invoice_no: all[i].order_no + 1,
//         orderstatus: singleLog,
//         payment: payment,
//       });
//     }

//     if (obj) {
//       success(res, 200, true, "Get data successfully", obj);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     throw new Error(error);
//   }
// });

//genarate bill number

const getBillNo = async (date) =>  {
  try {
      let setting = {
          start_inv_no: 1,
          inv_prifix:"INV",
          _id:"62317ecd7b8d2b2cd65aa101",
          bill_no_reset:"Yearly",
          createdAt:"2022-03-16T06:08:13.883+00:00",
          updatedAt:"2022-03-16T06:08:13.883+00:00"
        };
      let billString = generateBillString(date);
      let filter = billNoResetCondition(setting, billString);
      let bill_no;
      let check = await bill
          .findOne(filter)
          .sort({ bill_no: -1 });
      if (check)
          bill_no = check.bill_no + 1;
      else
          bill_no = setting.start_inv_no;
      return {
          bill_no: bill_no,
          invoice_prifix: setting.inv_prifix,
          invoice_no: setting.inv_prifix+bill_no,
          ...billString
      };
  }
  catch (error) {
      throw error;
  }
};


const billNoResetCondition = (setting, billString) => {
  try {
      let filter = {};
      switch (setting.bill_no_reset) {
          case "Monthly":
              filter = { month: billString.month, financial_year: billString.financial_year };
              break;
          case "Quarterly":
              filter = { quarterly: billString.quarterly, financial_year: billString.financial_year };
              break;
          case "Half Yearly":
              filter = { half_yearly: billString.half_yearly, financial_year: billString.financial_year };
              break;
          default:
              filter = { financial_year: billString.financial_year };
              break;
      }
      return filter;
  }
  catch (error) {
      throw error;
  }
};



const generateBillString = (date) => {
  try {
      let quarterly;
      let half_yearly;
      let month = date.getMonth();
      const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
      ];
      if (month >= 3 && month < 6)
          quarterly = "Q1";
      else if (month >= 6 && month < 9)
          quarterly = "Q2";
      else if (month >= 9 && month < 12)
          quarterly = "Q3";
      else
          quarterly = "Q4";
      if (quarterly == "Q1" || quarterly == "Q2")
          half_yearly = "H1";
      else
          half_yearly = "H2";
      let monthName = monthNames[month];
      let financial_year = financialYear(date);
      return {
          financial_year: financial_year,
          month: monthName,
          quarterly: quarterly,
          half_yearly: half_yearly,
      };
  }
  catch (error) {
      throw error;
  }
};


const financialYear = (date) => {
  let fy;
  let d = new Date(date);
  let year = d.getFullYear().toString();
  let month = d.getMonth();
  let ys = Number(year.substring(2, 4));
  if (month > 2) fy = ys + "-" + (ys + 1);
  else fy = ys - 1 + "-" + ys;
  return fy;
};


const createBillingInvoice = async (data) => {
  let date = new Date();
  let get_inv_no = await getBillNo(date);
  const form_data = {
    customer:data?.customer,
    order_id:data?._id,
    order_no:data?.order_no,
    financial_year:get_inv_no?.financial_year,
    quarterly:get_inv_no?.quarterly,
    half_yearly:get_inv_no?.half_yearly,
    month:get_inv_no?.month,
    bill_no:get_inv_no?.bill_no,
    invoice_no:get_inv_no?.invoice_no,
    invoice_prifix:get_inv_no?.invoice_prifix,
    company_details:data?.company_details, //
    delivery_address:data?.delivery_address, //
    products:data?.products, //
    tax:data?.tax,
    total:data?.total,
    no_of_items:data?.no_of_items,
    done_by:"",
  }
  await bill.create(form_data);
};


module.exports = {
  updateOrderAdmin,
  getsingleOrderAdmin,
  getallOrderAdmin,
  updateManyOrderAdmin
};