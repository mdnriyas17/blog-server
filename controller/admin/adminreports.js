const adminreport = require("../../models/adminreports");
const damages = require("../../models/damages");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const order = require("../../models/order");
const customer = require("../../models/customer");
const company = require("../../models/company");
const nodemailer = require('nodemailer');
//getall
const getallAdminReport = asyncHandler(async (req, res) => {
  try {
    const all = await adminreport.find().populate({
      path: "customer_id",
      model: "customer",
    }).populate({
      path: "bill_id",
      model: "bill",
    });
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
})

//create
const createAdminReport = asyncHandler(async (req, res) => {
  try {
    const customers = await customer.findOne({ _id: req.body.customer_id });
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });


    var transporter = nodemailer.createTransport({
      port : 465,
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: 'cauverywire@gmail.com',
        pass: 'nhlv wrqw zfsv hrzi'
      }
    });
    var mailOptions = {
      from: "cauverywire@gmail.com",  
      to: `${customers?.email_id}`,
      // cc: `${companyProfile?.email}`,
      cc:"cauverywire@gmail.com",
      subject: "Refund Payment Initiated Successfully",
      html: `<h2>Dear, M/s &nbsp;${customers.customer_name}</h2><br/>
      <p style="padding:0px; margin-top:0px"><b>Mobile No: ${customers?.mobile_number}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Refund Amount: ${req?.body?.amount}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Narration : ${req?.body?.description}</b></p>
      <p style="padding:0px; margin-top:0px">If any clarification Kindly contact us</p>
      <mark style="padding:0px; margin-top:0px"><b>Call Us : ${companyProfile.mobile_no},</b></mark><br/>
      <mark style="padding:0px; margin-top:0px"><b>Email Us : ${companyProfile.email}</mark></b><br/>
      <p style="padding:0px; margin-top:0px"><b>Thanks for your support and great co-operation.</b></p><br/>
      <p style="padding:0px; margin-top:0px">Warm Regards,</p><br/>
      <h2 style="padding:0px; margin-top:10px margin-bottom:10px">${companyProfile.company_name}</h2>
      <h4 style="padding:0px; margin-top:0px">${companyProfile.address_line1},${companyProfile.address_line2},
      ${companyProfile.area}</h4>
      <h4 style="padding:0px; margin-top:0px">${companyProfile.city},${companyProfile.state} - ${companyProfile.pincode}.</h4>
      <h4 style="padding:0px; margin-top:0px">GST.No : ${companyProfile.gst_no}</h4>
      <h4 style="padding:0px; margin-top:0px">PH.No : ${companyProfile.mobile_no}|E-Mail : ${companyProfile.email}</h4><br/>`,
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    const create = await adminreport.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  getallAdminReport,
  createAdminReport
}