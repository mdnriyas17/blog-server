const customer = require('../../models/customer');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const mongoose = require("mongoose");
const uniqid = require('uniqid');
//create
const createMasterUser = asyncHandler(async (req, res) => {
  req.body.company_id = new mongoose.mongo.ObjectId()+uniqid();
  const user_code = await customer.findOne({ user_code: req.body?.user_code });
  const mobile = await customer.findOne({ mobile_number: req.body?.mobile_number });
  const email = await customer.findOne({ email_id: req.body?.email_id });
  if (user_code) throw new Error("User code already exists");
  if (mobile) throw new Error("Mobile number already taken");
  if (email) throw new Error("Email address already taken");
  req.body.otp_verify = true;
  try {
    const create = await customer.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateMasterUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await customer.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await customer.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteMasterUser = asyncHandler(async (req, res) => {
  const { id } = req.params;  
  validateId(id);
  const check = await customer.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await customer.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleMasterUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await customer.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await customer.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});

//getall
const getallMasterUser = asyncHandler(async (req, res) => {
  const check = await customer.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await customer.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createMasterUser,
  updateMasterUser,
  deleteMasterUser,
  getsingleMasterUser,
  getallMasterUser,
};