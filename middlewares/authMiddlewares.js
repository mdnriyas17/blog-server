const customer = require("../models/customer");
const admin = require("../models/adminUser");
const staff = require("../models/staff");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { success } = require("../utils/response");
const authAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminc = await admin.findById(decoded?.id);
        const staffc = await staff.findById(decoded?.id);
        const customerc = await customer.findById(decoded?.id);
        if (adminc) {
          req.admin = adminc;
          req.role = adminc?.role;
          req.body.done_by = adminc?._id;
          next();
        } else if (staffc) {
          req.staff = staffc;
          req.role = staffc?.role;
          req.body.done_by = staffc?._id;
          req.body.option = staffc?.option;
          next();
        } else if (customerc) {
          req.customer = customerc;
          req.body.done_by = customerc?._id;
          req.body.customer_id = customerc?._id;
          req.query.customer_id = customerc?._id;
          next();
        } else {
          throw new Error("Invalid Token");
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});
const checkLogin = asyncHandler(async(req,res)=>{
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin1 = await admin.findById(decoded?.id);
        const staff1 = await staff.findById(decoded?.id);
        if (admin1) {
          success(res,200,true,'Token Valid');
        } else if (staff1) {
          success(res,200,true,'Token Valid');
        } else {
          throw new Error("Invalid Token");
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});


module.exports = { authAdmin , checkLogin };
