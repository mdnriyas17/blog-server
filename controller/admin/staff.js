const staff = require('../../models/staff');
const accesssettings = require('../../models/accessSettings');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const { access_permission } = require("../../utils/init");
//create
const createStaff = asyncHandler(async (req, res) => {
  const checkEmailAdmin = await staff.findOne({ email_id: req.body.email_id });
  const checkPhoneAdmin = await staff.findOne({ mobile_number: req.body.mobile_number });
  if (checkEmailAdmin) throw new Error("Email address already taken!");
  if (checkPhoneAdmin) throw new Error("Phone Number already taken!");
    try {
      const create = await staff.create(req.body);
      await accesssettings.create({
        staff_id: create._id,access_permission:access_permission
      });
      if (create) success(res, 201, true, "Created Successfully", create);
    } catch (error) {
      throw new Error(error);
    }
});
//update
const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await staff.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await staff.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error("Duplicate entries not allowed check email or phone number");
  }
});
//delete
const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await staff.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await staff.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await staff.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await staff.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallStaff = asyncHandler(async (req, res) => {
  const check = await staff.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await staff.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createStaff,
  updateStaff,
  deleteStaff,
  getsingleStaff,
  getallStaff,
};