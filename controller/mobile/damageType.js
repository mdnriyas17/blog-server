const damagetype = require('../../models/damagetype');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");


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
  getallDamgeType,
};