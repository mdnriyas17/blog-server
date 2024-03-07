
const customer = require('../../models/customer');
const logs = require('../../models/logs');
const asyncHandler = require("express-async-handler");
const { successToken,success } = require("../../utils/response");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const uniqid = require('uniqid');
const { generateToken } = require("../../config/jwtToken");
const { otpsms } = require('../../utils/sms');
const buyer_verify = require('../../models/buyer_verify');
const company = require('../../models/company');
var nodemailer = require('nodemailer');

//create
const createMasterUser = asyncHandler(async (req, res) => {
  const form_data = {...req.body};
  let exclude_code = ['company_id','role','otp_verify','created_date_time'];
  exclude_code.forEach((item) => delete form_data[item])
  const mobile = await customer.findOne({ mobile_number: req.body?.mobile_number,otp_verify:true });
  const email = await customer.findOne({ email_id: req.body?.email_id,otp_verify:true });
  // const customer_name = await customer.findOne({ customer_name: req.body?.customer_name });
  if (mobile) throw new Error("Mobile number already taken");
  if (email) throw new Error("Email address already taken");
  // if (customer_name) throw new Error("Customer name already taken");
  await customer.findOneAndDelete({ mobile_number: req.body?.mobile_number,otp_verify:false });
  await customer.findOneAndDelete({ email_id: req.body?.email_id,otp_verify:false });
  form_data.company_id = new mongoose.mongo.ObjectId()+uniqid();
  try {
    let result = {};
    let otp_code = generateOtp();
    let response;
    const create = await customer.create(form_data);
    const send_sms = await otpsms(create?.mobile_number, otp_code);
    if(send_sms) {
      response = await buyer_verify.create({
        customer_id: create?._id,
        mobile_number:create?.mobile_number,
        code: otp_code,
        smscode: send_sms?.data,
      });
    }
    result.customer_id = create?._id;
    result._id = response?._id;
    result.mobile_number = response?.mobile_number;
    // console.log(create);
    const companyProfile = await company.findOne({ admin_id: new ObjectId("648080de0feb907d4eeb4c37") }); 
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
      form: 'cauverywire@gmail.com',
      // from: 'mdjriyas1405@gmail.com',
      to: `${create?.email_id}`,
      // cc: `${companyProfile?.email}`,
      cc: 'cauverywire@gmail.com',
      subject: `Welcome To ${companyProfile?.company_name}`,
      html: `<h2>Dear, M/s &nbsp;${create?.customer_name}</h2><br/>
      <p style="padding:0px; margin-top:0px"><b>Mobile No: ${create?.mobile_number}</b></p>
      <p style="padding:0px; margin-top:0px"><b>Password: ${create?.password}</b></p>
      <p style="padding: 0px; margin-top: 0px;">
  <b>Playstore App Link: <a href="https://play.google.com/store/apps/details?id=com.cauvery.cauveryapp">Click Here</a></b>
</p>
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
    if (create) successToken(res, 201, true, "Register Successfully", result);
    else throw new Error("Please try again later");
  } catch (error) {
    throw new Error(error);
  }
});




//Admin login
const loginMasterUser = asyncHandler(async (req, res) => {
  const { mobile_number, password } = req.body;
  const check = await customer.findOne({ mobile_number});
  // console.log(check)
  if (!check) throw new Error("User not yet Registered");
  if(check?.password!=password) throw new Error("Invalid Password");
  try {
    const findAdmin = await customer.findOne({ mobile_number, otp_verify: true, status: true });
    
    const findPassword = findAdmin?.password == password;

    if (findAdmin && findPassword) {
      const createSession = await logs.create({ userid: findAdmin?._id });
      if (createSession) {
        successToken(res, 200, true, "Login successfully", {user_id:findAdmin?._id}, generateToken(findAdmin?._id), createSession?._id);
      } else {
        throw new Error("Please try again later");
      }
    } else {
      throw new Error("User Is Inactive");
    }
  } catch (err) {
    throw new Error(err);
  }
});

//Logout Admin
const logoutMasterUser = asyncHandler(async (req, res) => {
  try {
    const { sessionid } = req.body;
    const formData = {
      outtime: Date.now(),
      status:'c',
    }
    const sessionCheck = await logs.findById(sessionid);
    if (sessionCheck?.status == 'c') {
      throw new Error('Session already Logout!')
    } else {
      const sessionLogout = await logs.findByIdAndUpdate(sessionid, formData, {
        new: true,
      });
      if (sessionLogout) {
        return success(res, 200, true, "Logout Successfully", sessionLogout);
      } else {
        throw new Error("Session Logout Failed");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});


//update myprofile
const updateMyProfile = asyncHandler(async (req, res) => {
  const checkup = await customer.findById(req.customer?._id);
  if (!checkup) throw new Error("Data not found");
  req.body.email_id = checkup?.email_id;
  req.body.mobile_number = checkup?.mobile_number;
  if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path : checkup?.image;
  try {
    const update = await customer.findByIdAndUpdate(checkup?._id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});

//getsingle
const getsingleProfile = asyncHandler(async (req, res) => {
  const check = await customer.findById(req.customer?._id);
  if (!check) throw new Error("Data not found");
  try {
    const single = await customer.findOne({ _id: check?._id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//Otp
const otpwithlogin = asyncHandler(async (req, res) => {
  const { mobile_number  } = req.body;
  if(!mobile_number) throw new Error("Mobile number is required");
  const check = await customer.findOne({ mobile_number  });
  if (!check) throw new Error("User Not Found");
  const check1 = await customer.findOne({status:check?.status});
  if(check1.status==false) throw new Error("User is Inactive");
  try {
    let otp_code = generateOtp();
    let response_result = {};
    let response;
    const send_sms = await otpsms(mobile_number, otp_code);
    if(send_sms) {
      response = await buyer_verify.create({
        customer_id: check?._id,
        mobile_number,
        code: otp_code,
        smscode: send_sms?.data,
      });
      response_result._id=response?._id;
      response_result.customer_id=response?.customer_id;
      response_result.mobile_number=response?.mobile_number;
      success(res, 200, true, "OTP send successfully",response_result);
    } else {
      throw new Error("OTP send failed");
    }
  } catch (err) {
    throw new Error(err);
  }
});



const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

//verify method
const verifyMethod = asyncHandler(async (req, res) => {
  verifyOption(req?.body?.type);
  switch(req?.body?.type) {
    case 'loginverify':
      var { _id, customer_id, code, type } = req.body;
      if (!_id || !customer_id || !code || !type) throw new Error("All fields are required");
      var check_find = await buyer_verify.findOne({ _id:new ObjectId(_id) });
      if (!check_find) throw new Error("OTP not found");
      var check_exsist = await buyer_verify.findOne({_id:new ObjectId(_id),status:'v'});
      if(check_exsist) throw new Error("OTP already used!");
      var check = await buyer_verify.findOne({_id:new ObjectId(_id),status:"o",code:code,customer_id:new ObjectId(customer_id)});
      try {
        if (check) {
          await buyer_verify.findByIdAndUpdate(new ObjectId(_id), { status: 'v' }, { new: true });
          return successToken(res, 200, true, "OTP verified successfully", [], generateToken(customer_id));
        } else {
          throw new Error("OTP verification failed");
        }
        } catch(err) {
          throw new Error(err);
      }
    case 'registerverify':
      var { _id, customer_id, code, type } = req.body;
      if (!_id || !customer_id || !code || !type) throw new Error("All fields are required");
      var check_find = await buyer_verify.findOne({ _id:new ObjectId(_id) });
      if (!check_find) throw new Error("OTP not found");
      var check_exsist = await buyer_verify.findOne({_id:new ObjectId(_id),status:'v'});
      if(check_exsist) throw new Error("OTP already used!");
      var check = await buyer_verify.findOne({_id:new ObjectId(_id),status:"o",code:code,customer_id:new ObjectId(customer_id)});
      try {
        if (check) {
          await customer.findByIdAndUpdate(new ObjectId(check?.customer_id), { otp_verify: true }, { new: true });
          await buyer_verify.findByIdAndUpdate(_id, { status: 'v' }, { new: true });
          successToken(res, 200, true, "OTP verified successfully", [], generateToken(customer_id));
      } else {
        throw new Error("OTP verification failed");
      }
    } catch(err) {
      throw new Error(err);
    }
    case 'loginresend':
      var { mobile_number } = req.body;
      if(!mobile_number) throw new Error("Mobile number is required");
      var check = await customer.findOne({ mobile_number });
      if (!check) throw new Error("User Not Found");
      try {
        let otp_code = generateOtp();
        let response_result = {};
        let response;
        const send_sms = await otpsms(mobile_number, otp_code);
        if(send_sms) {
          response = await buyer_verify.create({
            customer_id: check?._id,
            mobile_number,
            code: otp_code,
            smscode: send_sms?.data,
          });
          response_result._id=response?._id;
          response_result.customer_id=response?.customer_id;
          response_result.mobile_number=response?.mobile_number;
          success(res, 200, true, "OTP send successfully",response_result);
        } else {
          throw new Error("OTP send failed");
        }
      } catch (err) {
        throw new Error(err);
      }
    case 'registerresend':
      var { mobile_number } = req.body;
      if(!mobile_number) throw new Error("Mobile number is required");
      var check = await customer.findOne({ mobile_number:mobile_number,otp_verify:false });
      if (!check) throw new Error("User Not Found");
      try {
        if (check) {
          let otp_code = generateOtp();
          let response_result = {};
          let response;
          const send_sms = await otpsms(mobile_number, otp_code);
          if(send_sms) {
            response = await buyer_verify.create({
              customer_id: check?._id,
              mobile_number,
              code: otp_code,
              smscode: send_sms?.data,
            });
            response_result._id=response?._id;
            response_result.customer_id=response?.customer_id;
            response_result.mobile_number=response?.mobile_number;
            success(res, 200, true, "OTP send successfully",response_result);
          } else {
            throw new Error("OTP send failed");
          }
      } else {
        throw new Error("OTP verification failed");
      }
      } catch (err) {
        throw new Error(err);
      }
    default:
      throw new Error("Invalid type");
  }
})


const verifyOption = (type) => {
  switch(type) {
    case 'loginverify':
      return 'loginverify';
    case 'registerverify':
      return 'registerverify';
    case 'registerresend':
      return 'registerresend';
    case 'loginresend':
      return 'loginresend';
    default:
      throw new Error("Invalid type");
  }
}

const companyProfileMobile = asyncHandler(async (req, res) => {
  try {
    const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });
    success(res, 200, true, "Get Successfully", companyProfile);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createMasterUser,
  loginMasterUser,
  logoutMasterUser,
  updateMyProfile,
  getsingleProfile,
  otpwithlogin,
  verifyMethod,
  companyProfileMobile
};


// const customer = require('../../models/customer');
// const logs = require('../../models/logs');
// const asyncHandler = require("express-async-handler");
// const { successToken,success } = require("../../utils/response");
// const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;
// const uniqid = require('uniqid');
// const { generateToken } = require("../../config/jwtToken");
// const { otpsms } = require('../../utils/sms');
// const buyer_verify = require('../../models/buyer_verify');
// const company = require('../../models/company');
// //create
// const createMasterUser = asyncHandler(async (req, res) => {
//   const form_data = {...req.body};
//   let exclude_code = ['company_id','role','otp_verify','created_date_time'];
//   exclude_code.forEach((item) => delete form_data[item])
//   const mobile = await customer.findOne({ mobile_number: req.body?.mobile_number,otp_verify:true });
//   const email = await customer.findOne({ email_id: req.body?.email_id,otp_verify:true });
//   if (mobile) throw new Error("Mobile number already taken");
//   if (email) throw new Error("Email address already taken");
//   await customer.findOneAndDelete({ mobile_number: req.body?.mobile_number,otp_verify:false });
//   await customer.findOneAndDelete({ email_id: req.body?.email_id,otp_verify:false });
//   form_data.company_id = new mongoose.mongo.ObjectId()+uniqid();
//   try {
//     let result = {};
//     let otp_code = generateOtp();
//     let response;
//     const create = await customer.create(form_data);
//     const send_sms = await otpsms(create?.mobile_number, otp_code);
//     if(send_sms) {
//       response = await buyer_verify.create({
//         customer_id: create?._id,
//         mobile_number:create?.mobile_number,
//         code: otp_code,
//         smscode: send_sms?.data,
//       });
//     }
//     result.customer_id = create?._id;
//     result._id = response?._id;
//     result.mobile_number = response?.mobile_number;
//     if (create) successToken(res, 201, true, "Register Successfully", result);
//     else throw new Error("Please try again later");
//   } catch (error) {
//     throw new Error(error);
//   }
// });




// //Admin login
// const loginMasterUser = asyncHandler(async (req, res) => {
//   try {
//     const { mobile_number, password } = req.body;
//     const findAdmin = await customer.findOne({ mobile_number:mobile_number,otp_verify:true });
//     const findPassword = findAdmin?.password==password;
    
//     if (findAdmin && findPassword) {
//       const createSession = await logs.create({ userid: findAdmin?._id });
//       if (createSession) {
//         successToken(res, 200, true, "Login successfully", [], generateToken(findAdmin?._id), createSession?._id);
//       } else {
//         throw new Error("Please try again later");
//       }
//     } else {
//       throw new Error("Invalid Credentials");
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// });

// //Logout Admin
// const logoutMasterUser = asyncHandler(async (req, res) => {
//   try {
//     const { sessionid } = req.body;
//     const formData = {
//       outtime: Date.now(),
//       status:'c',
//     }
//     const sessionCheck = await logs.findById(sessionid);
//     if (sessionCheck?.status == 'c') {
//       throw new Error('Session already Logout!')
//     } else {
//       const sessionLogout = await logs.findByIdAndUpdate(sessionid, formData, {
//         new: true,
//       });
//       if (sessionLogout) {
//         return success(res, 200, true, "Logout Successfully", sessionLogout);
//       } else {
//         throw new Error("Session Logout Failed");
//       }
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// //update myprofile
// // const updateMyProfile = asyncHandler(async (req, res) => {
// //   const checkup = await customer.findById(req.customer?._id);
// //   if (!checkup) throw new Error("Data not found");
// //   req.body.email_id = checkup?.email_id;
// //   req.body.mobile_number = checkup?.mobile_number;
// //   if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path : checkup?.image;
// //   try {
// //     const update = await customer.findByIdAndUpdate(checkup?._id, req.body, { new: true });
// //     if (update) success(res, 200, true, "Update Successfully");
// //   } catch (error) {
// //     throw new Error(error);
// //   }
// // });
// const updateMyProfile = asyncHandler(async (req, res) => {
//   const checkup = await customer.findById(req.customer?._id);
//   if (!checkup) throw new Error("Data not found");
//   req.body.email_id = checkup?.email_id;
//   req.body.mobile_number = checkup?.mobile_number;
//   if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path : checkup?.image;
//   try {
//     const update = await customer.findByIdAndUpdate(checkup?._id, req.body, { new: true });
//     if (update) success(res, 200, true, "Update Successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// //getsingle
// const getsingleProfile = asyncHandler(async (req, res) => {
//   const check = await customer.findById(req.customer?._id);
//   if (!check) throw new Error("Data not found");
//   try {
//     const single = await customer.findOne({ _id: check?._id });
//     if (single) success(res, 200, true, "Get data successfully", single);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// //Otp
// const otpwithlogin = asyncHandler(async (req, res) => {
//   const { mobile_number } = req.body;
//   if(!mobile_number) throw new Error("Mobile number is required");
//   const check = await customer.findOne({ mobile_number });
//   if (!check) throw new Error("User Not Found");

//   try {
//     let otp_code = generateOtp();
//     let response_result = {};
//     let response;
//     const send_sms = await otpsms(mobile_number, otp_code);
//     if(send_sms) {
//       response = await buyer_verify.create({
//         customer_id: check?._id,
//         mobile_number,
//         code: otp_code,
//         smscode: send_sms?.data,
//       });
//       response_result._id=response?._id;
//       response_result.customer_id=response?.customer_id;
//       response_result.mobile_number=response?.mobile_number;
//       success(res, 200, true, "OTP send successfully",response_result);
//     } else {
//       throw new Error("OTP send failed");
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// });



// const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// //verify method
// const verifyMethod = asyncHandler(async (req, res) => {
//   verifyOption(req?.body?.type);
//   switch(req?.body?.type) {
//     case 'loginverify':
//       var { _id, customer_id, code, type } = req.body;
//       if (!_id || !customer_id || !code || !type) throw new Error("All fields are required");
//       var check_find = await buyer_verify.findOne({ _id:new ObjectId(_id) });
//       if (!check_find) throw new Error("OTP not found");
//       var check_exsist = await buyer_verify.findOne({_id:new ObjectId(_id),status:'v'});
//       if(check_exsist) throw new Error("OTP already used!");
//       var check = await buyer_verify.findOne({_id:new ObjectId(_id),status:"o",code:code,customer_id:new ObjectId(customer_id)});
//       try {
//         if (check) {
//           await buyer_verify.findByIdAndUpdate(new ObjectId(_id), { status: 'v' }, { new: true });
//           return successToken(res, 200, true, "OTP verified successfully", [], generateToken(customer_id));
//         } else {
//           throw new Error("OTP verification failed");
//         }
//         } catch(err) {
//           throw new Error(err);
//       }
//     case 'registerverify':
//       var { _id, customer_id, code, type } = req.body;
//       if (!_id || !customer_id || !code || !type) throw new Error("All fields are required");
//       var check_find = await buyer_verify.findOne({ _id:new ObjectId(_id) });
//       if (!check_find) throw new Error("OTP not found");
//       var check_exsist = await buyer_verify.findOne({_id:new ObjectId(_id),status:'v'});
//       if(check_exsist) throw new Error("OTP already used!");
//       var check = await buyer_verify.findOne({_id:new ObjectId(_id),status:"o",code:code,customer_id:new ObjectId(customer_id)});
//       try {
//         if (check) {
//           await customer.findByIdAndUpdate(new ObjectId(check?.customer_id), { otp_verify: true }, { new: true });
//           await buyer_verify.findByIdAndUpdate(_id, { status: 'v' }, { new: true });
//           successToken(res, 200, true, "OTP verified successfully", [], generateToken(customer_id));
//       } else {
//         throw new Error("OTP verification failed");
//       }
//     } catch(err) {
//       throw new Error(err);
//     }
//     case 'loginresend':
//       var { mobile_number } = req.body;
//       if(!mobile_number) throw new Error("Mobile number is required");
//       var check = await customer.findOne({ mobile_number });
//       if (!check) throw new Error("User Not Found");
//       try {
//         let otp_code = generateOtp();
//         let response_result = {};
//         let response;
//         const send_sms = await otpsms(mobile_number, otp_code);
//         if(send_sms) {
//           response = await buyer_verify.create({
//             customer_id: check?._id,
//             mobile_number,
//             code: otp_code,
//             smscode: send_sms?.data,
//           });
//           response_result._id=response?._id;
//           response_result.customer_id=response?.customer_id;
//           response_result.mobile_number=response?.mobile_number;
//           success(res, 200, true, "OTP send successfully",response_result);
//         } else {
//           throw new Error("OTP send failed");
//         }
//       } catch (err) {
//         throw new Error(err);
//       }
//     case 'registerresend':
//       var { mobile_number } = req.body;
//       if(!mobile_number) throw new Error("Mobile number is required");
//       var check = await customer.findOne({ mobile_number:mobile_number,otp_verify:false });
//       if (!check) throw new Error("User Not Found");
//       try {
//         if (check) {
//           let otp_code = generateOtp();
//           let response_result = {};
//           let response;
//           const send_sms = await otpsms(mobile_number, otp_code);
//           if(send_sms) {
//             response = await buyer_verify.create({
//               customer_id: check?._id,
//               mobile_number,
//               code: otp_code,
//               smscode: send_sms?.data,
//             });
//             response_result._id=response?._id;
//             response_result.customer_id=response?.customer_id;
//             response_result.mobile_number=response?.mobile_number;
//             success(res, 200, true, "OTP send successfully",response_result);
//           } else {
//             throw new Error("OTP send failed");
//           }
//       } else {
//         throw new Error("OTP verification failed");
//       }
//       } catch (err) {
//         throw new Error(err);
//       }
//     default:
//       throw new Error("Invalid type");
//   }
// })


// const verifyOption = (type) => {
//   switch(type) {
//     case 'loginverify':
//       return 'loginverify';
//     case 'registerverify':
//       return 'registerverify';
//     case 'registerresend':
//       return 'registerresend';
//     case 'loginresend':
//       return 'loginresend';
//     default:
//       throw new Error("Invalid type");
//   }
// }

// const companyProfileMobile = asyncHandler(async (req, res) => {
//   try {
//     const companyProfile = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });
//     success(res, 200, true, "Get Successfully", companyProfile);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
//   createMasterUser,
//   loginMasterUser,
//   logoutMasterUser,
//   updateMyProfile,
//   getsingleProfile,
//   otpwithlogin,
//   verifyMethod,
//   companyProfileMobile
// };