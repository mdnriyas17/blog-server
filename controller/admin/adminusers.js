const adminuser = require('../../models/adminUser');
const staff = require('../../models/staff');
const company = require('../../models/company');
const logs = require('../../models/logs');
const asyncHandler = require("express-async-handler");
const { success,successToken } = require("../../utils/response");
const { generateToken } = require("../../config/jwtToken");

//create
const createUsers = asyncHandler(async (req, res) => {
  const checkEmailAdmin = await adminuser.findOne({ mobile_number: req.body.mobile_number });
  if (checkEmailAdmin) throw new Error("Email address already taken!");
  try {
      const create = await adminuser.create(req.body);
      if (create) success(res, 201, true, "Created Successfully", create);
    } catch (error) {
      throw new Error(error);
    }
});
// Admin login
// const loginAdmin = asyncHandler(async (req, res) => {
//   try {
//     const { mobile_number, password } = req.body;
//     const findAdmin = await adminuser.findOne({ mobile_number });
//     const findStaff = await staff.findOne({ mobile_number });
//     const findPassword = findAdmin?.password == password;
//     const findPasswordStaff = findStaff?.password == password;
//     const result_admin = await adminuser.findOne({ mobile_number }).select("role").select("firstname").select("lastname").select("status");
//     const result_staff = await staff.findOne({ mobile_number }).select("role").select("firstname").select("lastname").select("status");

//     let user;
//     let result;

//     if (findAdmin && findPassword) {
//       user = findAdmin;
//       result = result_admin;
//     } else if (findStaff && findPasswordStaff) {
//       user = findStaff;
//       result = result_staff;
//     } else {
//       throw new Error("In");
//     }

//     if (user && user.status === true) {
//       const createSession = await logs.create({ userid: user?._id });
//       if (createSession) {
//         successToken(res, 200, true, "Login successfully", result, generateToken(user?._id), createSession?._id);
//       } else {
//         throw new Error("Please try again later");
//       }
//     } else if (user && user.status === false) {
//       throw new Error("User is not active");
//     }
//   } catch (err) {
//     throw new Error("user Not Found");
//   }
// });
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    const findAdmin = await adminuser.findOne({ mobile_number });
    const findStaff = await staff.findOne({ mobile_number });
    const findPassword = findAdmin?.password == password;
    const findPasswordStaff = findStaff?.password == password;
    const result_admin = await adminuser.findOne({ mobile_number }).select("role").select("name").select("status");
    const result_staff = await staff.findOne({ mobile_number }).select("role").select("display_name").select("status");
    let user;
    let result;

    if (findAdmin && findPassword) {
      user = findAdmin;
      result = result_admin;
    } else if (findStaff && findPasswordStaff) {
      user = findStaff;
      result = result_staff;
    } else if (!findAdmin && !findStaff) {
      // User not registered
      throw new Error("User not registered");
    } else {
      // Incorrect password
      throw new Error("Incorrect password");
    }

    if (user && user.status === true) {
      const createSession = await logs.create({ userid: user?._id });
      if (createSession) {
        successToken(res, 200, true, "Login successfully", result, generateToken(user?._id), createSession?._id);
      } else {
        throw new Error("Please try again later");
      }
    } else if (user && user.status === false) {
      throw new Error("User is not active");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});



//Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
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

const companyProfile = asyncHandler(async (req, res) => {
  if(req?.files){
    req.body.logo = req?.files[0]?.path;
  }
  try {
    const companyProfile = await company.findOneAndUpdate(
      { admin_id: req?.admin?._id },
      req.body,{ new: true }
    );
    success(res, 200, true, "Company Profile Updated Successfully", companyProfile);
  } catch (error) {
    throw new Error(error);
  }
});

const companyProfileGet = asyncHandler(async (req, res) => {
  try {
    const companyProfile = await company.findOne().populate({
      path: "admin_id",
      model: "admin",
    });
    // console.log("companyProfileGet", companyProfile);
    success(res, 200, true, "Get Successfully", companyProfile);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUsers,
  loginAdmin,
  logoutAdmin,
  companyProfile,
  companyProfileGet
};