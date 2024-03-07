const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { success } = require("../utils/response");
const fs = require("fs").promises;
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const emailsender = async ({
  company: companyProfile,
  orderResult: result,
  taxable_bill: taxable_bill,
  gst_type: gst_type,
  converter: converter,
  date: text,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "cauverywire@gmail.com",
        pass: "nhlv wrqw zfsv hrzi",
      },
    });
    const mailOptions = {
      from: "cauverywire@gmail.com",
      to: `${result.order.customer.email_id}`,
      cc: "cauverywire@gmail.com",
      subject: `${text}`,
      html: `<h2>Dear, M/s &nbsp;${result.order.customer.customer_name}</h2><br/>
      <p style="padding:0px; margin-top:0px" line-height:1.5><b><i>Please Find attached with this email copy of the invoice.</i></b></p><br/>
      <p style="padding:0px; margin-top:0px">If any clarification Kindly contact us</p>
      <h4 style="padding:0px; margin-top:0px">PH.No : ${companyProfile.mobile_no}|E-Mail : ${companyProfile.email}</h4><br/>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { emailsender };

