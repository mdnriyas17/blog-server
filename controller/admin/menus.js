const menus = require('../../models/menus');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
//create
const createMenus = asyncHandler(async (req, res) => {
  if(req?.files) req.body.icon = req?.files[0]?.path ? req?.files[0]?.path : null;
  try {
    const create = await menus.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateMenus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await menus.findOne({ _id: id });
  if(req?.files) req.body.icon = req?.files[0]?.path ? req?.files[0]?.path : checkup?.icon;
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await menus.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteMenus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await menus.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await menus.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleMenus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await menus.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await menus.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallMenus = asyncHandler(async (req, res) => {
  try {
    const all = await menus.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createMenus,
  updateMenus,
  deleteMenus,
  getsingleMenus,
  getallMenus,
};