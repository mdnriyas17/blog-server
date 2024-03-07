const benner = require("../../models/benner");

const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");


//create

const createBenner = asyncHandler(async (req, res) => {
  if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path:null;
  try {
      const create = await benner.create(req.body);
      if (create) success(res, 201, true, "Created Successfully", create);
    } catch (error) {
      throw new Error(error);
    }
})


//update

const updateBenner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await benner.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path:checkup?.image;
  try {
    const update = await benner.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
})

//delete

const deleteBenner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await benner.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await benner.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
})


//getall

const getallBenner = asyncHandler(async (req, res) => {
  const check = await benner.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await benner.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
})


//getsingle

const getsingleBenner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await benner.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await benner.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
})


module.exports = {
  createBenner,
  updateBenner,
  deleteBenner,
  getsingleBenner,
  getallBenner
}