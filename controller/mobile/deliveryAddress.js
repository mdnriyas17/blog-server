const deliveryaddress = require('../../models/deliveryAddress');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const mongoose = require("mongoose");
//create
const createDeliveryAddress = asyncHandler(async (req, res) => {
  req.body.is_default_address = false;
  // console.log("req.body",req.body)
  try {
    const create = await deliveryaddress.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateDeliveryAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await deliveryaddress.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  req.body.is_default_address = false;
  try {
    const update = await deliveryaddress.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//set default
const updateDeliveryAddressDefault = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const setFalse = await deliveryaddress.updateMany({ customer_id: new mongoose.mongo.ObjectId(req?.body?.customer_id) },{$set:{is_default_address:false}});
  if(!setFalse) throw new Error('Please try again later!')
  validateId(id);
  const checkup = await deliveryaddress.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await deliveryaddress.updateOne({ _id: id },{$set:{is_default_address:true}});
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteDeliveryAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await deliveryaddress.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await deliveryaddress.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleDeliveryAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await deliveryaddress.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await deliveryaddress.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallDeliveryAddress = asyncHandler(async (req, res) => {
  try {
    const all = await deliveryaddress.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getsingleDeliveryAddress,
  getallDeliveryAddress,
  updateDeliveryAddressDefault,
};