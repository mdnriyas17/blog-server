const tax = require('../../models/tax');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
//create
const createTax = asyncHandler(async (req, res) => {
  try {
    const create = await tax.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateTax = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await tax.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await tax.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteTax = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await tax.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await tax.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleTax = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await tax.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await tax.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallTax = asyncHandler(async (req, res) => {
  try {
    const all = await tax.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createTax,
  updateTax,
  deleteTax,
  getsingleTax,
  getallTax,
};