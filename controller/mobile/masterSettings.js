const masterSettings = require("../../models/masterSettings");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");

//getsingle
const getSingleMasterSettingsMobile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await masterSettings.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await masterSettings.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getAllMasterSettingsMobile = asyncHandler(async (req, res) => {
  try {
    const all = await masterSettings.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getSingleMasterSettingsMobile,
  getAllMasterSettingsMobile
};
