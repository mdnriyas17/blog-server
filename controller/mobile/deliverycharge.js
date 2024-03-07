const deliverycharge = require("../../models/deliverycharge");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");

//getall
const getallDeliveryCharge = asyncHandler(async (req, res) => {
  const check = await deliverycharge.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await deliverycharge.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

//getsingle

const getSingleDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await deliverycharge.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await deliverycharge.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
  getallDeliveryCharge,
  getSingleDeliveryCharge
};