const paymentinfo = require("../../models/paymentInfo");
const paymentResponseLogModel = require("../../models/paymentResponseLogs");
const buyerAddress = require("../../models/deliveryAddress");
const order = require("../../models/order");
const orderlogs = require("../../models/orderLogs");
const cart = require("../../models/cart");
const customer = require("../../models/customer");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const { helperCart } = require("../../utils/helperCart");
const { initiatePayment } = require("../../controller/mobile/paymentService");
const financialYear = require("../../utils/financialyear");
const { placeordersms } = require('../../utils/sms');
const QRCode = require("qrcode"); 
const mongoose = require("mongoose");
const uniqid = require('uniqid');
const company = require("../../models/company");
const productiondetails = require("../../models/productiondetails");
const {emailsender} = require("../../utils/email");
const genarateinvoice = require("../admin/invoice");
const { ToWords } = require('to-words');
var nodemailer = require('nodemailer');

//create
const createPaymentInfo = asyncHandler(async (req, res) => {
  try {
    const cart_list = await helperCart(req);
    // console.log(cart_list.cart_item)
    const total_tax = cart_list?.total_tax;
    const customer_details = await customer.findOne({
      _id: req?.body?.customer_id,
    });
  
    if (cart_list.length === 0) {
      throw new Error("No items in cart");
    }
    if (!customer_details) {
      throw new Error("Customer does not exist");
    }
  
    const product = cart_list?.cart_item.map((e) => ({
      product: e?.product_id?._id,
      productspec_id: e?.prospec?._id,
      product_name: e?.product_id?.name,
      sku: e?.product_id?.sku,
      brand_id: e?.product_id?.brand_id,
      category_id: e?.product_id?.category_id,
      description: e?.product_id?.description,
      product_image:e?.product_id?.image,
      kg: e?.prospec?.kg,
      sp: e?.sp,
      qty: e?.qty,
      tax: e?.tax,
      default_margin: e?.default_margin,
      tax_persentage: e?.tax_persentage,
      total: e?.amount,
    }));
    const total_amount_pay = Math.round(product.reduce((c, e) => (c += e.total), 0));
    const create_payment_info = {
      customer: customer_details?._id,
      item: product,
      tax: Math.round(Number(total_tax)),
      delivery_charge: Math.round(Number(cart_list?.delivery_charge)),
      amount: Math.round(Number(total_amount_pay + total_tax + cart_list?.delivery_charge + cart_list?.default_margin)),
      name: customer_details?.customer_name,
      mobile_number: customer_details?.mobile_number,
      email_id: customer_details?.email_id,
    };
    const data = await paymentinfo.create(create_payment_info);
    const result = await initiatePayment(data);
    success(res, 200, true, "Success", result);
  } catch (err) {
    throw new Error(err);
  }
});

// Success
const successPayment = asyncHandler(async (req, res) => {
  try {
    await paymentResponseLogModel.create(req.body);
    const data = await paymentinfo.findByIdAndUpdate(req?.body?.txnid, {
      easepayid: req?.body?.easepayid,
      status: req?.body?.status,
      tnx_id:req?.body?.txnid,
      cancellation_reason: req?.body?.cancellation_reason,
      error_Message: req?.body?.error_Message,
      key: req?.body?.key,
      response: JSON.stringify(req?.body),
    });
    if (data && data.item) {
      const promises = data.item.map(async (item) => {
        const updatedProduct = await productiondetails.updateOne(
          { 'production_details._id': item.productspec_id },
          { $inc: { 'production_details.$.qty': -item.qty } }
        );
        return updatedProduct;
      });
      
    }
    if (data) {
      await placeOrder(data, res);
    }
  } catch (error) {
    throw error;
  }
});

//failure
const failure = asyncHandler(async (req, res) => {
  try {
    await paymentResponseLogModel.create(req.body);
    //console.log(req?.body)
    const data = await paymentinfo.findByIdAndUpdate(req?.body?.txnid, {
      easepayid: req?.body?.easepayid,
      status: req?.body?.status,
      cancellation_reason: req?.body?.cancellation_reason,
      error_Message: req?.body?.error_Message,
      key: req?.body?.key,
      response: JSON.stringify(req?.body),
    });
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
      to: `${req?.body?.email}`,
      // cc: `${companyProfile?.email}`,
     cc:"cauverywire@gmail.com",
      subject: `${req?.body?.error_Message}`,
      html: `<h2>Dear, M/s &nbsp;${req?.body?.firstname}</h2><br/>
      <p style="padding:0px; margin-top:0px"><b>Payment ID: ${req?.body?.easepayid}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Product Name: ${data?.item[0]?.product_name}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Kg: ${data?.item[0]?.kg}</b></p>
      <p style="padding:0px; margin-top:0px"><b>SKU: ${data?.item[0]?.sku}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Total Amount: ${req?.body?.amount}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Card Type: ${req?.body?.card_type}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Bank reference No: ${req?.body?.bank_ref_num}</b></p>
      <h4   style="padding:0px; margin-top:0px"><b>Status: ${(req?.body?.status).toUpperCase()}</b></h4><br/>
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
    if (data) {
      success(res, 500, true, "Payment Cancel Successfully!",data);
    }
  } catch (error) {
    throw error;
  }
});

const getOrderNo = async (date) => {
  try {
    let order_no = 1;
    let financial_year = financialYear(date);
    let check = await order
      .findOne({
        financial_year: financial_year,
      })
      .sort({ order_no: -1 });
    if (check) order_no += check.order_no;
    return {
      order_no: order_no,
      financial_year: financial_year,
    };
  } catch (error) {
    throw error;
  }
};

const placeOrder = async (data, res) => {
    try {
    const ckeckExist = await order.findOne({payment_id:data?._id});
    if(ckeckExist) {
      throw new Error('Patment already done!');
    }
    let delivery_address = await buyerAddress.findOne({
      customer_id: String(data?.customer),
      is_default_address: true,
    });
    let customer_number = await customer.findOne({
      _id: String(data?.customer)});
    if(!delivery_address) {
      throw new Error('Customer Delivery Address Not Set!')
    }
    const address = {
      firstname: delivery_address?.firstname,
      lastname: delivery_address?.lastname,
      city: delivery_address?.city,
      state: delivery_address?.state,
      landmark:delivery_address?.landmark,
      address_line_1: delivery_address?.address_line1,
      address_line_2: delivery_address?.address_line2,
      pincode: delivery_address?.pincode,
      mobile_no: customer_number?.mobile_number,
      alternate_no: delivery_address?.alternate_no,
    }
    //get company_details
    const company_get = await company.findOne({admin_id:"648080de0feb907d4eeb4c37"});
    const company_details = {
      invoice_text: company_get?.invoice_text,
      address_line1: company_get?.address_line1,
      address_line2: company_get?.address_line2,
      city: company_get?.city,
      state: company_get?.state,
      pincode: company_get?.pincode,
      country: company_get?.country,
      email: company_get?.email,
      gst_no: company_get?.gst_no,
      company_name: company_get?.company_name,  
      district: company_get?.district,
      area: company_get?.area,
      landline_no_1: company_get?.landline_no_1,
      landline_no_2: company_get?.landline_no_2,
      mobile_no: company_get?.mobile_no,
      pan_no: company_get?.pan_no,
      logo: company_get?.logo,
      website: company_get?.website,
      invoice_notes: company_get?.invoice_notes,
      invoice_title: company_get?.invoice_title,
    }
    let date = new Date();
    let product = [];
    function addDays(date, days) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
    const currentDate = new Date(); // Get the current date
    const daysToAdd = 3;
    for (let e of data?.item) {
      let qr_refid = uniqid();
      let q_id = `public/qrcode/${new mongoose.mongo.ObjectId()}.png`;
      QRCode.toFile(`${q_id}`, JSON.stringify(qr_refid), {
        errorCorrectionLevel: 'H'
      }, function(err) {
        if (err) throw err;
      });
      product.push({
        product: e.product,
        productspec_id: e.productspec_id,
        brand_id: e.brand_id,
        category_id: e.category_id,
        description: e.description,
        qrcode: q_id,
        qr_valid:addDays(currentDate,daysToAdd),
        qr_status:true,
        qr_scan:false,
        qr_refid:qr_refid,
        product_name: e.product_name,
        sku: e.sku,
        product_image: e.product_image,
        kg: e.kg,
        mrp: e.mrp,
        sp: e.sp,
        qty: e.qty,
        tax: e.tax,
        tax_persentage: e.tax_persentage,
        delivery_charge: e.delivery_charge,
        total: e.total,
      });
    }
    let ord_info = await getOrderNo(date);
    let careateOrder = await order.create({
      payment_id: data._id,
      customer: data.customer,
      company_details: company_details,
      order_no: ord_info.order_no,
      financial_year: ord_info.financial_year,
      date: date,
      tax: data.tax,
      delivery_address: address,
      products: product,
      total: data.amount,
      delivery_charge: data.delivery_charge,
      no_of_items: data?.item?.length,
    });
    await orderlogs.create({
      order_id: careateOrder._id,
      order_status: "Pending",
    })
    await placeordersms(customer_number?.mobile_number, customer_number?.customer_name, careateOrder?.order_no);
    let result = {};
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });
    const sisis = await order.findOne({ _id: careateOrder?._id }).populate("customer").populate({
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

    // console.log("sisis", sisis);
    const payment = await paymentResponseLogModel.find({ txnid: careateOrder?.payment_id});
    result.order = sisis;
    result.payment = payment || [];
    let taxable_bill=0;
    let gst_type=0;
    sisis.products.forEach((product) => {
     
      if(product.tax_persentage>0){
          taxable_bill=1;
      }
   });
   const converter = new ToWords();
   const text = "Your order has been placed successfully";
    await emailsender({company: companyProfile,orderResult:result,taxable_bill:taxable_bill,gst_type:gst_type,converter:converter,date:text});
    await cart.deleteMany({customer_id:String(data?.customer)});
    success(res,200,true,'Order Placed Successfully',{success:true});
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createPaymentInfo,
  failure,
  successPayment,
};
