const productiondetails = require("../../models/productiondetails");
const product = require("../../models/products");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");

//create

const createproductiondetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await productiondetails.findOne({ _id: id });
  const chechup1 = await (req.body.production_details[0].qty>0 && req.body.production_details[0].kg>0);
  if (!chechup1) throw new Error("Please enter valid kg and qty");
  if (!checkup) throw new Error("Data not found");
  try {
    const update = await productiondetails.findByIdAndUpdate(id, req.body, {
      new: true,
    });
 
    if (update) success(res, 200, true, "Update Successfully", update);
  } catch (error) {
    throw new Error(error);
  }
});

//update

// const updateproductiondetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const single = await productiondetails.findOne({ _id: id });
//   const create3 = await product
//     .findOne({ name: single["product_name"] })
//     .populate("brand_id category_id tax_persentage")
//     .exec();

//   if (!single) throw new Error("Data not found");
//   try {
//     const kgValue = parseFloat(req.body.production_details[0].kg).toFixed(4);
//     if (single.production_details) {
//       single.production_details.push({
//         kg: kgValue,
//         qty: req.body.production_details[0].qty,
//       });
//     }
  
//     const update = await productiondetails.findByIdAndUpdate(id, single, {
//       new: true,
//     });
//     if (update) success(res, 200, true, "Created Successfully", update);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const updateproductiondetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const single = await productiondetails.findOne({ _id: id });
  const chechup1 = await (req.body.production_details[0].qty>0 && req.body.production_details[0].kg>0);
  if (!chechup1) throw new Error("Please enter valid kg and qty");
  const create3 = await product
    .findOne({ name: single["product_name"] })
    .populate("brand_id category_id tax_persentage")
    .exec();

  if (!single) throw new Error("Data not found");
  try {
    const kgValue = parseFloat(req.body.production_details[0].kg);
    if (isNaN(kgValue)) {
      throw new Error("Invalid kg value");
    }
    const update = await productiondetails.findByIdAndUpdate(
      id,
      {
        $push: {
          production_details: {
            kg: kgValue.toFixed(4),
            qty: req.body.production_details[0].qty,
          },
        },
      },
      {
        new: true,
      }
    );

    if (update) {
      success(res, 200, true, "Created Successfully", update);
    }
  } catch (error) {
    throw new Error("Kg and qty are required");
  }
});

//delete
const deleteproductiondetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await productiondetails.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await productiondetails.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleproductiondetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await productiondetails.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await productiondetails.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallproductiondetails = asyncHandler(async (req, res) => {
  try {
    const all = await productiondetails.find().populate({
      path: "product_details.brand_id",
      model: "mastersettings",
    }).populate({
      path: "product_details.category_id",
      model: "mastersettings",
    }).exec();
    const updatedAll = await productiondetails.updateMany(
      { "production_details.qty": 0 },
      { $pull: { production_details: { qty: 0 } } },
      { multi: true }
    );
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createproductiondetails,
  updateproductiondetails,
  deleteproductiondetails,
  getsingleproductiondetails,
  getallproductiondetails,
};
