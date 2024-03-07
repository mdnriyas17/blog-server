const mastersettings = require('../../models/masterSettings');
const products = require('../../models/products');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
//create
const createMasterSettings = asyncHandler(async (req, res) => {
  if (req?.files) {
    req.body.image = req?.files[0]?.path || null;
  }
  try {
    const create = await mastersettings.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error("invalid data");
  }
});
//update
const updateMasterSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await mastersettings.findOne({ _id: id });
  if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path : checkup?.image;
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await mastersettings.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteMasterSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const category = await mastersettings.findOne({ _id: id });
    if (!category) {
      throw new Error("Category not found");
    }
    const hasMappings = await checkMappings(category);
    if (hasMappings ) {
      throw new Error("Category has associated subcategories or products.");
    }
    const remove = await mastersettings.findByIdAndDelete(id);
    if (remove) {
      success(res, 200, true, "Deleted Successfully");
    }
  } catch (error) {
    throw new Error(error);
  }
});

async function checkMappings(category) {
  const hasSubcategories = await mastersettings.findOne({ category_id: category._id });
  const hasProducts = await products.findOne({ category_id: category._id });
  return hasSubcategories || hasProducts;
}


//getsingle
const getsingleMasterSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await mastersettings.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await mastersettings.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallMasterSettings = asyncHandler(async (req, res) => {
  try {
    const all = await mastersettings.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createMasterSettings,
  updateMasterSettings,
  deleteMasterSettings,
  getsingleMasterSettings,
  getallMasterSettings,
};