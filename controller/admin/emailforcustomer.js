// const nodemailer = require("nodemailer");
// const fs = require("fs").promises;
// const ejs = require("ejs");
// const puppeteer = require("puppeteer");

// // Async function to send emails
// const customerprint = async ({
// }) => {
//   try {
//     // Read EJS file asynchronously
//     // const emailTemplate = await fs.readFile(
//     //   "./public/views/invoice.ejs",
//     //   "utf-8"
//     // );

//     // // Compile EJS template
//     // const compiledTemplate = ejs.compile(emailTemplate);

//     // // Your template data
//     // const templateData = {
     
//     // };

//     // // Render EJS template with data
//     // const emailHTML = compiledTemplate(templateData);

//     // // Launch a headless browser with the new headless mode
//     // const browser = await puppeteer.launch({ headless: "new" });
//     // const page = await browser.newPage();

//     // // Set the HTML content
//     // await page.setContent(emailHTML);

//     // // Generate PDF
//     // const pdfBuffer = await page.pdf({ format: "A4" });

//     // // Close the browser
//     // await browser.close();

//     // Nodemailer configuration
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "mdjriyas1405@gmail.com",
//         pass: "tnuu lons denj whmd",
//         // user: 'cauverywire@gmail.com',
//         // pass: 'nhlv wrqw zfsv hrzi'
//       },
//     });

//     // Email options
//     const mailOptions = {
//       // from: 'cauverywire@gmail.com',
//       // to: "venkat@blazon.in",
//       from: "mdjriyas1405@gmail.com",
//       to:"mdjriyas1405@gmail.com",
//       // to: `${result.order.customer.email_id}`,
//       // cc: `${companyProfile?.email}`,
//       cc: "mdjriyas1405@gmail.com",
//       // subject: `${text}`,
//     //   html: `<h2>Dear, M/s &nbsp;${result.order.customer.customer_name}</h2><br/>
//     //   <p style="padding:0px; margin-top:0px" line-height:1.5><b><i>Please Find attached with this email copy of the invoice.</i></b></p><br/>
//     //   <p style="padding:0px; margin-top:0px">If any clarification Kindly contact us</p>
//     //   <mark style="padding:0px; margin-top:0px"><b>Call Us : ${companyProfile.mobile_no},</b></mark><br/>
//     //   <mark style="padding:0px; margin-top:0px"><b>Email Us : ${companyProfile.email}</mark></b><br/>
//     //   <p style="padding:0px; margin-top:0px"><b>Thanks for your support and great co-operation.</b></p><br/>
//     //   <p style="padding:0px; margin-top:0px">Warm Regards,</p><br/>
//     //   <h2 style="padding:0px; margin-top:10px margin-bottom:10px">${companyProfile.company_name}</h2>
//     //   <h4 style="padding:0px; margin-top:0px">${companyProfile.address_line1},${companyProfile.address_line2},
//     //   ${companyProfile.area}</h4>
//     //   <h4 style="padding:0px; margin-top:0px">${companyProfile.city},${companyProfile.state} - ${companyProfile.pincode}.</h4>
//     //   <h4 style="padding:0px; margin-top:0px">GST.No : ${companyProfile.gst_no}</h4>
//     //   <h4 style="padding:0px; margin-top:0px">PH.No : ${companyProfile.mobile_no}|E-Mail : ${companyProfile.email}</h4><br/>`,
//     //   attachments: [
//     //     {
//     //       filename: "invoice.pdf",
//     //       content: pdfBuffer,
//     //     },
//     //   ],
//     };

//     // Send email
//     // const info = await transporter.sendMail(mailOptions);
//     // console.log("Email sent:", info.response);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = {
//   customerprint 
//  };

// Working Email Code -- start 

/* 
const asyncHandler = require("express-async-handler");
var nodemailer = require('nodemailer');

const sendEmail = asyncHandler(async (req, res) => {

var transporter = nodemailer.createTransport({
  port : 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "mdjriyas1405@gmail.com",
    pass: "tnuu lons denj whmd",
  }
});

var mailOptions = {
  from: 'mdjriyas1405@gmail.com',
  to: 'satwizard4u@gmail.com',
  subject: 'Sending Email to test Node.js nodemailer',
  text: 'That was easy to test!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
} else {
    console.log('Email sent');

  }
});

})

module.exports = {
    sendEmail
}

// Working Email Code --end 

*/

const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");  
const customer = require("../../models/customer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const validateId  = require("../../utils/validateId");
const customerprint = asyncHandler(async (req, res) => {
  try {
    const id = req.body._id;
    // console.log("email", id);
    validateId(id);

    const customerProfile = await customer.findById({ _id: id });
    // console.log(customerProfile);
    // console.log(req?.files);

    const transporter = nodemailer.createTransport({
      port : 465,
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: 'cauverywire@gmail.com',
        pass: 'nhlv wrqw zfsv hrzi'
      },
    });

    const mailOptions = {
      from: "cauverywire@gmail.com",
      to: `${customerProfile?.email_id}`,
      cc:"cauverywire@gmail.com",
      subject: "Customer Summary",
      html: `<h2>Dear, M/s &nbsp;${customerProfile?.customer_name}</h2><br/>`,
      attachments: [
        {
          filename: "Customer Summary.pdf",
          path: req?.files[0]?.path,
        },
      ],
    };

    // console.log("resss", req?.files[0]?.path);

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.response);

    if (info) {
      success(res, 200, true, "Email sent successfully", info);
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle the error appropriately, you might want to send a failure response
    // For example: res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


module.exports = {
  customerprint
}
