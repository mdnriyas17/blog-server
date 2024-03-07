const company = require('../../models/company');
const asyncHandler = require("express-async-handler");
const order = require('../../models/order');
const validateId = require("../../utils/validateId");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const orderlogs = require("../../models/orderLogs");
const express = require('express') // ^4.18.1
const ejs = require("ejs"); // 3.1.8
const { ToWords } = require('to-words');
const {emailsender} = require("../../utils/email");
express()

const generateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });

    const check = await order.findOne({ _id: id });
    if (!check) throw new Error("Data not found");

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
      result.invoice_no = single?.order_no + 1,
      result.orderlogs = singleLog || [];
      result.payment = payment || [];

      let taxable_bill=0;
      let gst_type=0;
      single.products.forEach((product) => {
       
        if(product.tax_persentage>0){
            taxable_bill=1;
        }
     });
     const date = "Your Order Generated on"
     const converter = new ToWords();
    //  await emailsender({company: companyProfile,orderResult:result,taxable_bill:taxable_bill,gst_type:gst_type,converter:converter})
      ejs.renderFile("./public/views/invoice.ejs", {company: companyProfile,orderResult:result,taxable_bill:taxable_bill,gst_type:gst_type,converter:converter}, (err, data) => {
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
    generateInvoice
}