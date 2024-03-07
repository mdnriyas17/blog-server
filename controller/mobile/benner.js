const benner = require("../../models/benner");

const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");

//get all

const getallBenner = asyncHandler(async (req, res) => {
  try {
    const all = await benner.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
})


module.exports = {
  getallBenner,
}