const pages = require('../../models/pages');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
//create
const createPage = asyncHandler(async (req, res) => {
  try {
      const create = await pages.create(req.body);
      if (create) success(res, 201, true, "Created Successfully", create);
    } catch (error) {
      throw new Error("Duplicate entries not allowed");
    }
});
//update
const updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await pages.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await pages.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error('Duplicate entries not allowed');
  }
});

//delete
const deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await pages.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await pages.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle by id 

const getsinglePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await pages.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await pages.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallPage = asyncHandler(async (req, res) => {
  const check = await pages.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await pages.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
// const getallPage = asyncHandler(async (req, res) => {
//   const check = await pages.find().countDocuments();
//   if (check===0) throw new Error("Data not found");
//   try {
//     const all = await pages.find();
//     if (all) success(res, 200, true, "Get data successfully", all);
//   } catch (error) {
//     throw new Error(error);
//   }
});

module.exports = {
  createPage,
  updatePage,
  deletePage,
  getsinglePage,
  getallPage,
};
