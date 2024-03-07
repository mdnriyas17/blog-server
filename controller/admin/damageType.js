const damagetype = require('../../models/damagetype');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");

//create
const createDamgeType = asyncHandler(async (req, res) => {
  const check = await damagetype.findOne({ damage_type: req?.body?.damage_type });
  if (check) throw new Error("Damage type already exsist");
  try {
    const create = await damagetype.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateDamgeType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await damagetype.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await damagetype.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteDamgeType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await damagetype.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await damagetype.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleDamgeType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await damagetype.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await damagetype.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});

//getall
const getallDamgeType = asyncHandler(async (req, res) => {
  const check = await damagetype.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await damagetype.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createDamgeType,
  updateDamgeType,
  deleteDamgeType,
  getsingleDamgeType,
  getallDamgeType,
};