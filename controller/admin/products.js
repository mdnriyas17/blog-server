const products = require('../../models/products');
const productiondetails = require('../../models/productiondetails');
const dailypricedetails = require('../../models/dailyprice');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const masterSettings = require("../../models/masterSettings");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//create
// const createProduct = asyncHandler(async (req, res) => {
//   let image_path = [];
//   if (req?.files) req?.files?.forEach((e) => { image_path.push(e?.path) });
//   req.body.image = image_path;

//   try {
//     // Generate a new ObjectId
//     const uniqueId = new ObjectId();

//     const create = await products.create({
//       ...req.body,
//       _id: uniqueId, // Use _id instead of id for ObjectId
//     });
//     const create1 = await productiondetails.create({
//       product_name: req.body.name,
//       _id: uniqueId,
//       product_details: req.body, // Full data sent to productiondetails
//     });
//     const create2 = await dailypricedetails.create({
//       product_name: req.body.name,
//       _id: uniqueId,
//     });

//     if (create && create1 && create2) {
//       success(res, 201, true, "Created Successfully", create);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const createProduct = asyncHandler(async (req, res) => {
  let image_path = [];
  if (req?.files) req?.files?.forEach((e) => { image_path.push(e?.path) });
  req.body.image = image_path;

  try {
    // Generate a new ObjectId
    const uniqueId = new ObjectId();

    const create = await products.create({
      ...req.body,
      _id: uniqueId,
    });
    // const create1 = await productiondetails.create({
    //   product_name: req.body.name,
    //   _id: uniqueId,
    //   product_details: req.body,
    // });
    // const create2 = await dailypricedetails.create({
    //   product_name: req.body.name,
    //   product_details: req.body,
    //   _id: uniqueId,
    // });

    if (create) {
      success(res, 201, true, "Created Successfully", create);
    }
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await products.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  // let image_path = checkup?.image;
  if(req?.files) req.body.image = req?.files[0]?.path ? req?.files[0]?.path : checkup?.image;
 
  try {
    const update = await products.findByIdAndUpdate(id, req.body, { new: true });
    const create1 = await productiondetails.findByIdAndUpdate(id,{product_name: req.body.name, product_details: req.body}, { new: true });
    const create2 = await dailypricedetails.findByIdAndUpdate(id,{product_name: req.body.name}, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } 
  catch (error) {
    if (error.code === 11000){
      throw new Error("Duplicate Product Name or SKU.");
    }
    else {
      throw new Error("Duplicate Product Name or SKU");
    }
  }
});

//delete
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await products.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await products.findByIdAndDelete(id);
    const create2 = await dailypricedetails.deleteOne({product_name: check.name});
    const create1 = await productiondetails.deleteOne({product_name: check.name});
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await products.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await products.findOne({ ...req.query,_id: id }).populate('brand_id category_id tax_persentage').exec();
    const create3 = await productiondetails.find({product_name: check.name});
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallProduct = asyncHandler(async (req, res) => {
  try {
    const all = await products.find(req.query).populate('brand_id category_id tax_persentage').exec();

    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getsingleProduct,
  getallProduct,
  
};