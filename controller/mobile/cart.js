// // const cart = require("../../models/cart");
// // const product = require("../../models/products");
// // const asyncHandler = require("express-async-handler");
// // const { success } = require("../../utils/response");
// // const validateId = require("../../utils/validateId");
// // const mongoose = require("mongoose");
// // const { helperCart } = require("../../utils/helperCart");
// // const productiondetails = require("../../models/productiondetails");
// // const deliveryChargeModule = require("../../utils/distanse");
// // const customer = require("../../models/customer");
// // const createCart = asyncHandler(async (req, res) => {
// //   // const { id } = req.params;
// //   // validateId(id);
// //   try {
// //     const updateqty = await productiondetails.findOne({
// //             _id: new mongoose.Types.ObjectId(req?.body?.product_id),
// //           })



// //     const add_verify = await productiondetails.findOne({
// //       _id: new mongoose.Types.ObjectId(req?.body?.product_id),
// //       "production_details._id": new mongoose.Types.ObjectId(
// //         req?.body?.productspec_id
// //       ),
// //     });

// //     if (add_verify) {
// //       const alreadyExist = await cart.findOne({
// //         productspec_id: req?.body?.productspec_id,
// //         customer_id: new mongoose.Types.ObjectId(req?.body?.customer_id),
// //       });
// //       if (alreadyExist) {
// //         const quanty = (Number(alreadyExist?.qty)+Number(req?.body?.qty));
// //         // const deliverycharge=(Number(alreadyExist?.delivery_charge)+Number(req?.body?.delivery_charge));// delivery charge
// //         const updateAccess = await cart.findByIdAndUpdate(
// //           alreadyExist._id,
// //           {qty:quanty},
// //           // {delivery_charge:deliverycharge}, // delivery charge added
// //           { new: true }
// //         );
// //         if (updateAccess) {
// //           success(res, 200, true, "Update Successfully", updateAccess);
// //         }
// //       } else {
// //         const create = await cart.create(req.body);
// //         if (create) success(res, 201, true, "Created Successfully", create);
// //       }
// //     } else {
// //       throw "Product Does Not Exsist!";
// //     }
// //   } catch (error) {
// //     throw new Error(error);
// //   }
// // });
// // //update
// // const updateCart = asyncHandler(async (req, res) => {
// //   const { id } = req.params;
// //   validateId(id);
// //   try {
// //     const add_verify = await product.findOne({
// //       _id: new mongoose.Types.ObjectId(req?.body?.product_id),
// //       "box_quantity._id": new mongoose.Types.ObjectId(
// //         req?.body?.productspec_id
// //       ),
// //     });
// //     if (add_verify) {
// //       const update = await cart.findByIdAndUpdate(id, req.body, { new: true });
// //       if (update) success(res, 200, true, "Update Successfully", update);
// //     } else {
// //       throw "Product Does Not Exsist!";
// //     }
// //   } catch (error) {
// //     throw new Error(error);
// //   }
// // });
// // //delete
// // const deleteCart = asyncHandler(async (req, res) => {
// //   const { id } = req.params;
// //   validateId(id);
// //   const check = await cart.findOne({ _id: id });
// //   if (!check) throw new Error("Data not found");
// //   try {
// //     const remove = await cart.findByIdAndDelete(id);
// //     if (remove) success(res, 200, true, "Deleted Successfully");
// //   } catch (error) {
// //     throw new Error(error);
// //   }
// // });


// // //getall
// // const getallCart = asyncHandler(async (req, res) => {
// //     try {
// //       const result = await helperCart(req);
// //       if (result) success(res, 200, true, "Get data successfully", result);
// //       else success(res, 200, true, "Data Not Found", []);
// //       console.log("result",result);
// //     } catch (err) {
// //       throw new Error(err);
// //     }
// // });

// // module.exports = {
// //   createCart,
// //   updateCart,
// //   deleteCart,
// //   getallCart,
// // };

  
// const cart = require("../../models/cart");
// const product = require("../../models/products");
// const asyncHandler = require("express-async-handler");
// const { success } = require("../../utils/response");
// const validateId = require("../../utils/validateId");
// const mongoose = require("mongoose");
// const { helperCart } = require("../../utils/helperCart");
// const productiondetails = require("../../models/productiondetails");
// // const  getDeliveryCharge  = require("../../utils/distanse");
// //create
// const createCart = asyncHandler(async (req, res) => {
//   try {

//     const add_verify = await product.findOne({
//       _id: new mongoose.Types.ObjectId(req?.body?._id),
//       "production_details._id": new mongoose.Types.ObjectId(
//         req?.body?.productspec_id
//       ),
      
//     });
//     console.log("add_verify",product.id)
//     if (add_verify) {
//       const alreadyExist = await cart.findOne({
//         productspec_id: req?.body?.productspec_id,
//         customer_id: new mongoose.Types.ObjectId(req?.body?.customer_id),
//       });
//       if (alreadyExist) {
//         const quanty = (Number(alreadyExist?.qty)+Number(req?.body?.qty));
//         const updateAccess = await cart.findByIdAndUpdate(
//           alreadyExist._id,
//           {qty:quanty},
//           { new: true }
//         );
//         if (updateAccess) {
//           success(res, 200, true, "Update Successfully", updateAccess);
//         }
//       } else {
//         const create = await cart.create(req.body);
//         if (create) success(res, 201, true, "Created Successfully", create);
//       }
//     } else {
//       throw "Product Does Not Exsist!";
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// //update
// const updateCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   try {
//     const add_verify = await product.findOne({
//       _id: new mongoose.Types.ObjectId(req?.body?.product_id),
//       "box_quantity._id": new mongoose.Types.ObjectId(
//         req?.body?.productspec_id
//       ),
//     });
//     if (add_verify) {
//       const update = await cart.findByIdAndUpdate(id, req.body, { new: true });
//       if (update) success(res, 200, true, "Update Successfully", update);
//     } else {
//       throw "Product Does Not Exsist!";
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// //delete
// const deleteCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const check = await cart.findOne({ _id: id });
//   if (!check) throw new Error("Data not found");
//   try {
//     const remove = await cart.findByIdAndDelete(id);
//     if (remove) success(res, 200, true, "Deleted Successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// //getall
// // const getallCart = asyncHandler(async (req, res) => {
// //     try {
// //       const result = await helperCart();
// //       if (result) success(res, 200, true, "Get data successfully", result);
// //       else success(res, 200, true, "Data Not Found", []);
// //     } catch (err) {
// //       throw new Error(err);
// //     }
// // });

// // const getallCart = asyncHandler(async (req, res) => {
// //   try {
// //     const result = await cart.find().populate(["product_id customer_id"]);
// //     if (result) success(res, 200, true, "Get data successfully", result);
// //     else success(res, 200, true, "Data Not Found", []);
// //   } catch (err) {
// //     throw new Error(err);
// //   }
// // });

// const getallCart = asyncHandler(async (req, res) => {
//   try {
//     const result = await cart.find().populate("product_id customer_id");
//     if (result) success(res, 200, true, "Get data successfully", result);
//     else success(res, 200, true, "Data Not Found", []);
//   } catch (err) {
//     throw new Error(err);
//   }
// });
// module.exports = {
//   createCart,
//   updateCart,
//   deleteCart,
//   getallCart,
// };
// const cart = require("../../models/cart");
// const product = require("../../models/products");
// const asyncHandler = require("express-async-handler");
// const { success } = require("../../utils/response");
// const validateId = require("../../utils/validateId");
// const mongoose = require("mongoose");
// const { helperCart } = require("../../utils/helperCart");
// const productiondetails = require("../../models/productiondetails");
// const deliveryChargeModule = require("../../utils/distanse");
// const customer = require("../../models/customer");
// const createCart = asyncHandler(async (req, res) => {
//   // const { id } = req.params;
//   // validateId(id);
//   try {
//     const updateqty = await productiondetails.findOne({
//             _id: new mongoose.Types.ObjectId(req?.body?.product_id),
//           })



//     const add_verify = await productiondetails.findOne({
//       _id: new mongoose.Types.ObjectId(req?.body?.product_id),
//       "production_details._id": new mongoose.Types.ObjectId(
//         req?.body?.productspec_id
//       ),
//     });

//     if (add_verify) {
//       const alreadyExist = await cart.findOne({
//         productspec_id: req?.body?.productspec_id,
//         customer_id: new mongoose.Types.ObjectId(req?.body?.customer_id),
//       });
//       if (alreadyExist) {
//         const quanty = (Number(alreadyExist?.qty)+Number(req?.body?.qty));
//         // const deliverycharge=(Number(alreadyExist?.delivery_charge)+Number(req?.body?.delivery_charge));// delivery charge
//         const updateAccess = await cart.findByIdAndUpdate(
//           alreadyExist._id,
//           {qty:quanty},
//           // {delivery_charge:deliverycharge}, // delivery charge added
//           { new: true }
//         );
//         if (updateAccess) {
//           success(res, 200, true, "Update Successfully", updateAccess);
//         }
//       } else {
//         const create = await cart.create(req.body);
//         if (create) success(res, 201, true, "Created Successfully", create);
//       }
//     } else {
//       throw "Product Does Not Exsist!";
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// //update
// const updateCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   try {
//     const add_verify = await product.findOne({
//       _id: new mongoose.Types.ObjectId(req?.body?.product_id),
//       "box_quantity._id": new mongoose.Types.ObjectId(
//         req?.body?.productspec_id
//       ),
//     });
//     if (add_verify) {
//       const update = await cart.findByIdAndUpdate(id, req.body, { new: true });
//       if (update) success(res, 200, true, "Update Successfully", update);
//     } else {
//       throw "Product Does Not Exsist!";
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// //delete
// const deleteCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const check = await cart.findOne({ _id: id });
//   if (!check) throw new Error("Data not found");
//   try {
//     const remove = await cart.findByIdAndDelete(id);
//     if (remove) success(res, 200, true, "Deleted Successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// //getall
// const getallCart = asyncHandler(async (req, res) => {
//     try {
//       const result = await helperCart(req);
//       if (result) success(res, 200, true, "Get data successfully", result);
//       else success(res, 200, true, "Data Not Found", []);
//       console.log("result",result);
//     } catch (err) {
//       throw new Error(err);
//     }
// });

// module.exports = {
//   createCart,
//   updateCart,
//   deleteCart,
//   getallCart,
// };

  
const cart = require("../../models/cart");
const product = require("../../models/products");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const mongoose = require("mongoose");
const { helperCart } = require("../../utils/helperCart");
const productiondetails = require("../../models/productiondetails");
// const  getDeliveryCharge  = require("../../utils/distanse");
//create
const createCart = asyncHandler(async (req, res) => {
  try {

    const add_verify = await productiondetails.findOne({
      _id: new mongoose.Types.ObjectId(req?.body?.product_id),
      "production_details._id": new mongoose.Types.ObjectId(
        req?.body?.productspec_id
      ),
      
    });
    
    if (add_verify) {
      const alreadyExist = await cart.findOne({
        productspec_id: req?.body?.productspec_id,
        customer_id: new mongoose.Types.ObjectId(req?.body?.customer_id),
      });
      if (alreadyExist) {
        const quanty = (Number(alreadyExist?.qty)+Number(req?.body?.qty));
        const updateAccess = await cart.findByIdAndUpdate(
          alreadyExist._id,
          {qty:quanty},
          { new: true }
        );
        if (updateAccess) {
          success(res, 200, true, "Update Successfully", updateAccess);
        }
      } else {
        const create = await cart.create(req.body);
        if (create) success(res, 201, true, "Added to Cart", create);
      }
    } else {
      throw "Product Does Not Exsist!";
    }
  } catch (error) {
    throw new Error(error);
  }
});
//update
const updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const add_verify = await productiondetails.findOne({
      _id: new mongoose.Types.ObjectId(req?.body?.product_id),
      "production_details._id": new mongoose.Types.ObjectId(
        req?.body?.productspec_id
      ),
    });
    if (add_verify) {
      const update = await cart.findByIdAndUpdate(id, req.body, { new: true });
      if (update) success(res, 200, true, "Update Successfully", update);
    } else {
      throw "Product Does Not Exsist!";
    }
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await cart.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await cart.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});


//getall
const getallCart = asyncHandler(async (req, res) => {
    try {
      const result = await helperCart(req);
      if (result) success(res, 200, true, "Get data successfully", result);
      else success(res, 200, true, "Data Not Found", []);
    } catch (err) {
      throw new Error(err);
    }
});
const deletenam = asyncHandler(async (req, res) => {
  try {
    const remove = await cart.deleteMany();
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCart,
  updateCart,
  deleteCart,
  getallCart,
  deletenam
};