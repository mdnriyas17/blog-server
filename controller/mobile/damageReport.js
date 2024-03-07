const paymentinfo = require("../../models/paymentInfo");
const ordersss = require("../../models/order");
const damage = require("../../models/damages");
const asyncHandler = require("express-async-handler");
const orderlogs = require("../../models/orderLogs");
const ObjectId = require("mongoose").Types.ObjectId;
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const { success } = require("../../utils/response");
const company = require('../../models/company');
var nodemailer = require('nodemailer');
const customersss = require("../../models/customer");
//create report
const createDamageReport = asyncHandler(async (req, res) => {
  let form_data = {};
  const {order_id,customer_id,qr_refid,spec_id,damage_type,damage_message} = req.body;
  if(!order_id || !customer_id || !qr_refid || !spec_id || !damage_type) throw new Error("All fiels are required");
  if(req?.files) form_data.images = req?.files[0]?.path ? req?.files[0]?.path : null;
  form_data.order_id = order_id;
  form_data.customer_id = customer_id;
  form_data.qr_refid = qr_refid;
  form_data.spec_id = spec_id;
  form_data.damage_type = damage_type;
  form_data.damage_message = damage_message;
 
  let date = new Date();
  let check = await ordersss
  .findOne({ 
    _id: new ObjectId(req.body.order_id), 
    customer: new ObjectId(req.body.customer_id),
    products:{
      $elemMatch:{
        _id:new ObjectId(req.body.spec_id),
        qr_refid:req.body.qr_refid,
        qr_valid:{$gte:date},
        qr_status:true,
        qr_scan:false,
      }
    }
  });
  if(!check) throw new Error("Invalid QR Code!");
  try {
  
    const create = await damage.create(form_data);
    
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" }); 
    const customer = await customersss.findOne({ _id: new ObjectId(req.body.customer_id) });
    const order = await ordersss.findOne({ _id: new ObjectId(req.body.order_id) });
    const final = order?.products?.find((obj) => obj._id == req.body.spec_id)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mdjriyas1405@gmail.com',
        pass: 'tnuu lons denj whmd'
      }
    });
    var mailOptions = {
      from: 'mdjriyas1405@gmail.com',
      to: `${customer?.email_id}`,
      // cc: `${companyProfile?.email}`,
      cc: 'mdjriyas1405@gmail.com',
      subject: "Your Damage Report Created Successfully",
      html: `<h2>Dear, M/s &nbsp;${customer.customer_name}</h2><br/>
      <p style="padding:0px; margin-top:0px"><b>Mobile No: ${customer?.mobile_number}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Product Name: ${final?.product_name}</b></p>
      <p style="padding:0px; margin-top:0px"><b>SKU : ${final?.sku}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Quantity : ${final?.qty}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Kg : ${final?.kg}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Price Per Kg : ${final?.sp}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Price Before Tax : ${final?.total}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Tax : ${(final?.tax).toFixed(2)}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Amount : ${(final?.total+(final?.tax)).toFixed(2)}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Your Damage Message: ${create?.damage_message}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Your Order No: ${order?.order_no}</b></p>
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
    if(create) {
      await ordersss.findOneAndUpdate(
        { "products._id": new ObjectId(spec_id) }, 
        { $set: { 
          "products.$.qr_status": false,
          "products.$.qr_scan": true,
         } 
      });
      // const orderLogs = await orderlogs.create(create);
      success(res, 200, true, "Created Successfully", create);
 
    } else {
      throw new Error("Something went wrong");
    }
    
  } catch (error) {
    throw new Error(error);
  }
});




module.exports = {
  createDamageReport
}