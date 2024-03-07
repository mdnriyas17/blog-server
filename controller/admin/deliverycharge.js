const deliverycharge = require("../../models/deliverycharge");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");

//create

const createDeliveryCharge = asyncHandler(async (req, res) => {
  try {
    if(req.body.status===true){
      const update = await deliverycharge.updateMany({ status: true }, { $set: { status: false } });
    }
    else{
     throw new Error("Status should be true");
    } 
    const create = await deliverycharge.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error);
  }
})

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
})


//getsingle 

const getsingleDeliveryCharge = asyncHandler(async (req, res) => {
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


//delete

const deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const stats = await deliverycharge.findOne({ _id: id });
  const chec1 = stats.status
  if (chec1 === true) throw new Error("You can't delete active data");
  const check = await deliverycharge.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await deliverycharge.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
})

//update

const updateDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    if(req.body.status===true){
      const update1 = await deliverycharge.updateMany({ status: true }, { $set: { status: false } });
      const update = await deliverycharge.findByIdAndUpdate(id, req.body, { new: true });
      if (update) success(res, 200, true, "Update Successfully");
    }else if(req.body.status===false){
      throw new Error("You can't disable All Delivery Charge"); 
    }
  } catch (error) {
    throw new Error(error);
  }
})


module.exports = {
  createDeliveryCharge,
  getallDeliveryCharge,
  getsingleDeliveryCharge,
  deleteDeliveryCharge,
  updateDeliveryCharge
}