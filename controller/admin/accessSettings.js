const accesssettings = require("../../models/accessSettings");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const {access_permission } = require("../../utils/init");
const {MasterMenus} = require("../../utils/init");

//create 


const createAccess = asyncHandler(async (req, res) => {
  const check = await accesssettings.findOne({ staff_id: req.body?.staff_id });
  if (check) await accesssettings.deleteOne({staff_id:check?.staff_id});
  try {
    const create = await accesssettings.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update Access Settings
const updateAccessStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await accesssettings.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await accesssettings.findByIdAndUpdate(id,req.body, {
      new: true,
    });
    if (update) success(res, 201, true, "Updated Successfully", update);
  } catch (error) {
    throw new Error(error);
  }
});
//get single Access Settings
const getSingleAccessStaff = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await accesssettings.findOne({ staff_id: id });
    if (!check){
      const create = await MasterMenus;
      success(res, 201, true, "Get Successfully", create);
    };
    try {
      const single = await accesssettings.findOne({ staff_id: id });
      if (single) success(res, 200, true, "Get Successfully", single);
    } catch (error) {
      throw new Error(error);
    }
  });
//get single Access Settings
const getSingleAccessStaffOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await accesssettings.findOne({ staff_id: id });
  if (!check){
    const create = await MasterMenus.find();
    success(res, 201, true, "Get Successfully", create);
  };
});

//get all Access Settings

const getAllAccessStaff = asyncHandler(async (req, res) => {
  const check = await accesssettings.find().countDocuments();

  if (check===0) throw new Error("Data not found");
  try {
    const all = await accesssettings.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});
//get all Access Settings Map
const getAllAccessMap = asyncHandler(async (req, res) => {
  try {
    success(res, 201, true, "Get Successfully", access_permission);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  updateAccessStaff,
  createAccess,
  getSingleAccessStaff,
  getAllAccessStaff,
  getAllAccessMap,
  getSingleAccessStaffOne
};
