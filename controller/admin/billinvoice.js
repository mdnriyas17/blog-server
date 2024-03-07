const company = require('../../models/company');
const asyncHandler = require("express-async-handler");
const order = require('../../models/order');
const validateId = require("../../utils/validateId");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const orderlogs = require("../../models/orderLogs");
const express = require('express') // ^4.18.1
const ejs = require("ejs"); // 3.1.8
const { ToWords } = require('to-words');
const bill = require("../../models/bill");
express()

const getSingleBillInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });

    const check = await bill.findOne({ _id: id });
    if (!check) throw new Error("Data not found");

    let result = {};
    const single = await bill.findOne({ _id: id }).populate("customer").populate({
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
      }).populate({
        path: "order_id",
        model: "order",
        populate: [
          {
            path: "products",
            model: "product",
          },
          {
            path: "products.category_id",
            model: "mastersettings",
          },
          {
            path: "products.brand_id",
            model: "mastersettings",
          },
          {
            path: "customer",
            model: "customer",
          },
        ],
      })
      .exec();
      const payment = await paymentResponseLogModel.find({ txnid: single?.order_id?.payment_id});
      result.order = single;
      result.payment = payment || [];
      let taxable_bill=0;
      let gst_type=0;
      single.products.forEach((product) => {
       
        if(product.tax_persentage>0){
            taxable_bill=1;
        }
     });
     const converter = new ToWords();
    //  console.log(result.order.date);
     ejs.renderFile("./public/views/bill.ejs", {company: companyProfile,orderResult:result,taxable_bill:taxable_bill,gst_type:gst_type,converter:converter}, (err, data) => {
      if (err) {
            res.send(err);
         } else {
          res.writeHead(200, { 'Content-Type':'text/html'});
          res.write(data);
          res.end();
      }
  });
  })
module.exports = {
  getSingleBillInvoice,
}




