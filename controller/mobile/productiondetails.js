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

  if (!checkup) throw new Error("Data not found");
  try {
    const update = await productiondetails.findByIdAndUpdate(id, req.body, { new: true });
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});

  //update

const updateproductiondetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await productiondetails.findOne({ _id: id });
  const create3 = await product.findOne({ name: checkup["product_name"] }).populate('brand_id category_id tax_persentage').exec();

  if (!checkup) throw new Error("Data not found");
  
  try {
   const  newproductiondetails ={
     kg:req.body.production_details[0].kg,
     qty:req.body.production_details[0].qty,
   }

   const dublicateindex=checkup.production_details.findIndex((item)=>{
     item.kg==newproductiondetails.kg
   });
   if(dublicateindex!=-1){
  
checkup.production_details[dublicateindex]=newproductiondetails;
   } else {
     checkup.production_details.push(newproductiondetails,all_data);  
   }
  //  console.log("all_data",all_data);
   const update = await productiondetails.findByIdAndUpdate(id, checkup,all_data, { new: true });
   if (update) success(res, 200, true, "Update Successfully",update);
  } 
  
  catch (error) {
    throw new Error(error);
  }
})

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
  try {
    
    const single = await productiondetails.findOne({ _id: id });

    const create3 = await product.findOne({ name: single["product_name"] }).populate('brand_id category_id tax_persentage').exec();
   
    var all_data = [];
    var avalible_box = 0;
    for(let i=0;i<single["production_details"].length;i++){

      avalible_box+=single["production_details"][i]["qty"];
    }
      // all_data = single;
      const sortedArray = single.production_price_details.sort((a, b) => {
        if (a.status === true && b.status === false) return -1;
        if (a.status === false && b.status === true) return 1;
        return 0;
      });
      
      const trueValues = sortedArray.filter(item => item.status === true);
      // Convert array to object
      const trueValuesObject = trueValues.reduce((acc, item) => {
        acc[item] = item;
        return item;
      }, {});
      

    all_data.push({"_id":single["_id"],"name":single["product_name"],
    "description": create3["description"],
    "image": 
       create3["image"],
    "brand_id":create3["brand_id"],"category_id":create3["category_id"],"tax_persentage":create3["tax_persentage"],"default_margin": create3["default_margin"],
    "sku": create3["sku"],
    "status": create3["status"],
    "done_by": create3["done_by"],
    "created_date_time": create3["created_date_time"],
    "createdAt": create3["createdAt"],
    "updatedAt": create3["updatedAt"],
    "production_price_details":trueValuesObject,"box_quantity":single["production_details"],"avalible_box":avalible_box,
    });
 
    const update = await productiondetails.findByIdAndUpdate(id, single, { new: true });
    // console.log("update",all_data);
    if (update) success(res, 200, true, "Get data successfully", all_data); 

  } catch (error) {
    throw new Error(error);
  }
})
    //getall
    const getallproductiondetails = asyncHandler(async (req, res) => {
      try {
        const single = await productiondetails.find(req.query);
        const create3 = await product.find(req.query).populate('brand_id category_id tax_persentage').exec();
        var all_data = [];
    
        for (let i = 0; i < single.length; i++) {
          const sortedArray = single[i].production_price_details.sort((a, b) => {
            if (a.status === true && b.status === false) return -1;
            if (a.status === false && b.status === true) return 1;
            return 0;
          });
          const trueValues = sortedArray.filter(item => item.status === true);
          const trueValuesObject = trueValues.reduce((acc, item) => {
            acc[item] = item;
            return item;
          }, {});
    
          const productionDetails = single[i]["production_details"];
    
          const totalAvailableBoxes = productionDetails.reduce((total, item) => {
            return total + item.qty;
          }, 0);
          all_data.push({
            "_id": single[i]["_id"],
            "name": single[i]["product_name"],
            "image": create3[i]["image"],
            "description": create3[i]["description"],
            "default_margin": create3[i]["default_margin"],
            "sku": create3[i]["sku"],
            "status": create3[i]["status"],
            "price": trueValuesObject["price"],
            "availible_box": single[i]["production_details"],
            "avalible_box": totalAvailableBoxes,
            "brand_id": create3[i]["brand_id"],
            "category_id": create3[i]["category_id"],
            "tax_persentage": create3[i]["tax_persentage"],
            "done_by": create3[i]["done_by"],
            "created_date_time": create3[i]["created_date_time"],
            "createdAt": create3[i]["createdAt"],
            "updatedAt": create3[i]["updatedAt"],
           
          });
        }
        
        all_data.sort((a, b) => {
          const categoryOrder = {
            "Normal OD": 0,
            "Lesser OD": 1,
          };
        
          const categoryComparison = categoryOrder[a.category_id[0].name] - categoryOrder[b.category_id[0].name];
          if (categoryComparison !== 0) {
            return categoryComparison;
          }
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          
          return 0;
        });
        success(res, 200, true, "Get data successfully", all_data);
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

// const productiondetails = require("../../models/productiondetails");
// const product = require("../../models/products");
// const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;
// const asyncHandler = require("express-async-handler");
// const { success } = require("../../utils/response");
// const validateId = require("../../utils/validateId");

//   //create

// const createproductiondetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const checkup = await productiondetails.findOne({ _id: id });

//   if (!checkup) throw new Error("Data not found");
//   try {
//     const update = await productiondetails.findByIdAndUpdate(id, req.body, { new: true });
//     if (update) success(res, 200, true, "Update Successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//   //update

// const updateproductiondetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const checkup = await productiondetails.findOne({ _id: id });
//   console.log("checkup",checkup.product_name)
//   const create3 = await product.findOne({ name: checkup["product_name"] }).populate('brand_id category_id tax_persentage').exec();


//   if (!checkup) throw new Error("Data not found");
  
//   try {
//    const  newproductiondetails ={
//      kg:req.body.production_details[0].kg,
//      qty:req.body.production_details[0].qty,
//    }

//    const dublicateindex=checkup.production_details.findIndex((item)=>{
//      item.kg==newproductiondetails.kg
//    });
//    if(dublicateindex!=-1){
  
// checkup.production_details[dublicateindex]=newproductiondetails;
//    } else {
//      checkup.production_details.push(newproductiondetails,all_data);  
//    }
//    console.log("all_data",all_data);
//    const update = await productiondetails.findByIdAndUpdate(id, checkup,all_data, { new: true });
//    if (update) success(res, 200, true, "Update Successfully",update);
//   } 
  
//   catch (error) {
//     throw new Error(error);
//   }
// })

// //delete
// const deleteproductiondetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const check = await productiondetails.findOne({ _id: id });
//   if (!check) throw new Error("Data not found");
//   try {
//     const remove = await productiondetails.findByIdAndDelete(id);
//     if (remove) success(res, 200, true, "Deleted Successfully");
//   } catch (error) {
//     throw new Error(error);
//   }
// });
//getsingle

// const getsingleproductiondetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   try {
    
//     const single = await productiondetails.findOne({ _id: id });

//     const create3 = await product.findOne({ name: single["product_name"] }).populate('brand_id category_id tax_persentage').exec();
//   //  console.log("create3", create3.id);
//   //  console.log("single", single.id);
//     var all_data = [];
//     var avalible_box = 0;
//     for(let i=0;i<single["production_details"].length;i++){

//       avalible_box+=single["production_details"][i]["qty"];
//     }
//       // all_data = single;
//       const sortedArray = single.production_price_details.sort((a, b) => {
//         if (a.status === true && b.status === false) return -1;
//         if (a.status === false && b.status === true) return 1;
//         return 0;
//       });
      
//       const trueValues = sortedArray.filter(item => item.status === true);
//       // Convert array to object
//       const trueValuesObject = trueValues.reduce((acc, item) => {
//         acc[item] = item;
//         return item;
//       }, {});
      

//     all_data.push({"_id":single["_id"],"name":single["product_name"],
//     "description": create3["description"],
//     "image": 
//        create3["image"],
//     "brand_id":create3["brand_id"],"category_id":create3["category_id"],"tax_persentage":create3["tax_persentage"],"default_margin": create3["default_margin"],
//     "sku": create3["sku"],
//     "status": create3["status"],
//     "done_by": create3["done_by"],
//     "created_date_time": create3["created_date_time"],
//     "createdAt": create3["createdAt"],
//     "updatedAt": create3["updatedAt"],
//     "production_price_details":trueValuesObject,"box_quantity":single["production_details"],"avalible_box":avalible_box,
//     });
 
//     const update = await productiondetails.findByIdAndUpdate(id, single, { new: true });
//     if (update) success(res, 200, true, "Get data successfully", all_data); 

//   } catch (error) {
//     throw new Error(error);
//   }
// })
// const getsingleproductiondetails = asyncHandler(async (req, res) => {
//   let result = {};
//   const { id } = req.params;
//   validateId(id);
//   const check = await productiondetails.findOne({ _id: id });
//   if (!check) throw new Error("Data not found");
//   try {
//     // const single1 = await productiondetails.aggregate([
//     //   {
//     //     $lookup: {
//     //       from: "products",
//     //       localField: "product_name",
//     //       foreignField: "name",
//     //       as: "product"
//     //     }
//     //   },
//     //   { $match: { product_name: check.product_name } },
//     //   { $limit: 1 },
//     // ])
//     // result.production_details = single1;
//     var all1 = await productiondetails.aggregate([
//       {
//         $lookup: {
//           from: "product",
//           localField: "name",
//           foreignField: "product_name",
//           as: "product"
//         }
//       },
//       {
//         $lookup: {
//           from: "mastersettings",
//           localField: "brand_id",
//           foreignField: "_id",
//           as: "brand"
//         }
//       },
//       {
//         $lookup: {
//           from: "mastersettings",
//           localField: "category_id",
//           foreignField: "_id",
//           as: "category"
//         }
//       },
//       {
//         $lookup: {
//           from: "taxes",
//           localField: "tax_persentage",
//           foreignField: "_id",
//           as: "tax"
//         }
//       },
//      {
//         $unwind: "$brand"
//       },
//       {
//         $unwind: "$tax_persentage"
//       },
//       {
//         $group: {
//           _id: "$_id", 
//           name: { $first: "$name" },// Group by the product's _id or any other unique identifier
//           description: { $first: "$description" },// Group by the product's _id or any other unique identifier
//           image: { $first: "$image" },// Group by the product's _id or any other unique identifier
//           tax_persentage: { $first: "$tax_persentage" },// Group by the product's _id or any other unique identifier
//           default_margin: { $first: "$default_margin" },// Group by the product's _id or any other unique identifier
//           sku: { $first: "$sku" },// Group by the product's _id or any other unique identifier
//           brand: { $first: "$brand" }, // Include other fields using $first
//           category: { $first: "$category" },
//           tax_percentage: { $first: "$tax_persentage" },
//           availible_box: { $push: "$productiondetails.production_details" },
//           avalible_box: { $sum: "$productiondetails.production_details.qty" },
//           productiodetails: {
//             $first: {
//               _id: "$productiondetails._id",
//               product_name: "$productiondetails.product_name",
//               product_details: "$productiondetails.product_details",
//               production_price_details: {
//                 $filter: {
//                   input: "$productiondetails.production_price_details",
//                   as: "priceDetail",
//                   cond: { $eq: ["$$priceDetail.status", true] }
//                 }
//               }
//             }
//           },
//           // productiodetails: { $first: "$productiondetails" },
         
//           // Add more fields as needed
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           description: 1,
//           image: 1,
//           tax_percentage: 1,
//           default_margin: 1,
//           sku: 1,
//           brand: 1,
//           category: 1,
//           tax_percentage: 1,
//           price: {
//             $reduce: {
//               input: "$productiodetails.production_price_details",
//               initialValue: "",
//               in: {
//                 $concat: ["$$value", { $toString: "$$this.price" }, ""]
//               }
//             }
//           },
//           availible_box: 1,
//           avalible_box: 1,
//           // Add more fields as needed
//         }
//       },
//       { $match: { _id: new ObjectId(id) } },
//       { $limit: 1 },
   
//     ])
//     result.product = all1;
//     const single = await productiondetails.findOne({ _id: id });
//     if (single) success(res, 200, true, "Get data successfully", result);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
    //getall
// const getallproductiondetails = asyncHandler(async (req, res) => {
//   try {
    
//     const single = await productiondetails.find(req.query)
//     const create3 = await product.find(req.query).populate('brand_id category_id tax_persentage' ).exec();
//      var all_data = [];
//     for(let i=0;i<single.length;i++){
//       //sort true values
//       // console.log("single[i].production_price_details",single[i].production_price_details)
//       const sortedArray = single[i].production_price_details.sort((a, b) => {
//         if (a.status === true && b.status === false) return -1;
//         if (a.status === false && b.status === true) return 1;
//         return 0;
//       });
//       const trueValues = sortedArray.filter(item => item.status === true);
//       // Convert array to object
//       const trueValuesObject = trueValues.reduce((acc, item) => {
//         acc[item] = item;
//         return item;
//       }, {});

//   const productionDetails = single[i]["production_details"];

// // Calculate total available boxes
// const totalAvailableBoxes = productionDetails.reduce((total, item) => {

//   return total + item.qty;
  
// }, 0);

// //  console.log("totalAvailableBoxes",single[i]["_id"]);
//       all_data.push({"_id":single[i]["_id"],"name":single[i]["product_name"],
//       "image": create3[i]["image"],
//       "description": create3[i]["description"],
//       "default_margin": create3[i]["default_margin"],"sku": create3[i]["sku"],
//       "status": create3[i]["status"],
//       "price": trueValuesObject["price"],
//       "availible_box": single[i]["production_details"],
//       "avalible_box":totalAvailableBoxes,
//       "brand_id":create3[i]["brand_id"],"category_id":create3[i]["category_id"],"tax_persentage":create3[i]["tax_persentage"],
//       "done_by": create3[i]["done_by"],
//       "created_date_time": create3[i]["created_date_time"],
//       "createdAt": create3[i]["createdAt"],

//     }); 
//     }
    
//     const update = await productiondetails.findByIdAndUpdate( single, { new: true });
//     if (update) success(res, 200, true, "Get data successfully", all_data);

//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getallproductiondetails = asyncHandler(async (req, res) => {
//   try {
//     const all = await productiondetails.find(req.query)
//     const all1 = await productiondetails.aggregate([
//       {
//         $lookup: {
//           from: "products",
//           localField: "product_name",
//           foreignField: "name",
//           as: "product"
//         }
//       },{
//         $lookup: {
//           from: "mastersettings",
//           localField: "product.brand_id",
//           foreignField: "_id",
//           as: "brand"
//         }
//       },{
//         $lookup: {
//           from: "mastersettings",
//           localField: "product.category_id",
//           foreignField: "_id",
//           as: "category"
//         }
//       },
//       {
// $lookup: {
//   from: "taxes",
//   localField: "product.tax_persentage",
//   foreignField: "_id",
//   as: "tax"
// }
//       }

//     ])
//     const create3 = await product.find(req.query).populate('brand_id category_id tax_persentage' ).exec();
    
//     if (all) success(res, 200, true, "Get data successfully", all1);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getallproductiondetails = asyncHandler(async (req, res) => {
//   const all = await productiondetails.find(req.query)  
//   console.log("all",all)
//   const create3 = await productiondetails.aggregate([
//     {
//       $lookup: {
//         from: "products",
//         localField: "product_name",
//         foreignField: "name",
//         as: "product"
//       }
//     },
//     {
//       $lookup: {
//         from: "mastersettings",
//         localField: "product.brand_id",
//         foreignField: "_id",
//         as: "brand"
//       }
//     },
//     {
//       $lookup: {
//         from: "mastersettings",
//         localField: "product.category_id",
//         foreignField: "_id",
//         as: "category"
//       }
//     },
//     {
//       $lookup: {
//         from: "taxes",
//         localField: "product.tax_persentage",
//         foreignField: "_id",
//         as: "tax"
//       }
//     },
//     {

//       $unwind: "$product"
//     },
    
//     {
//       $group: {
//         _id: "$_id",
//         product_name: { $first: "$product_name" },
//         image: { $first: "$product.image" },
//         description: { $first: "$product.description" },
//         default_margin: { $first: "$product.default_margin" },
//         sku: { $first: "$product.sku" },
//         status: { $first: "$product.status" },
//         price: { $first: "$production_price_details.price" },
//         availible_box: { $first: "$production_details" },
//         avalible_box: { $sum: "$production_details.production_details.qty" },
       
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         description: 1,
//         image: 1,
//         tax_percentage: 1,
//         default_margin: 1,
//         sku: 1,
//         brand: 1,
//         category: 1,
//         tax_percentage: 1,
//         availible_box: 1,
//         avalible_box: 1,
//         // Add more fields as needed
//       }
//     }
    
 
//   ])
//   // console.log("create3", create3)
//   if (all) success(res, 200, true, "Get data successfully", create3);

// })
// module.exports = {
//   createproductiondetails,
//   updateproductiondetails,
//   deleteproductiondetails,
//   getsingleproductiondetails,
//   getallproductiondetails,
// };