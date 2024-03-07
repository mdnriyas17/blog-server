const bill = require("../../models/bill");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");


// const getallBill = asyncHandler(async (req, res) => {
//   try {
//     let options = {};
//     let createdAt;
//     let products;
//     let total;
//     let filter;
//     const queryObj = { ...req.query };
//     console.log(req.query)
//     const excludeFields = ["company_code","startdate","enddate","min","max","products","user"];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     if(req?.query?.startdate && req?.query?.enddate && req?.query?.startdate!="" && req?.query?.enddate!="") {
//       createdAt =  {
//         $gte: new Date(req?.query?.startdate).getDate() -1,
//         $lte: new Date(req?.query?.enddate)
//       };
      
//       filter = {...queryObj,createdAt}
      
//       } else {
//         createdAt =  {}
//         filter = {...queryObj}
        
//       } 
//       if(req?.query?.min && req?.query?.max && req?.query?.min!="" && req?.query?.max!="") {
//         total = {
//           $gte: req?.query?.min,
//           $lte: req?.query?.max
//         }
//         filter = {...filter,total}
//       }
//       if(req?.query?.products && req?.query?.products!='') {
//         filter = {...filter,"products.product":req?.query?.products}
//       }
//       if(req?.query?.user && req?.query?.user!="") {
//         filter = {...filter,customer:req?.query?.user}
//       }

//     const all = await bill.find(filter).populate({
//       path:"customer",
//       model:"customer",
//     }).exec();
//     if (all) success(res, 200, true, "Get data successfully", all);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getallBill = asyncHandler(async (req, res) => {
  try {
    let options = {};
    let createdAt;
    let products;
    let total;
    let filter;
    const queryObj = { ...req.query };
    const excludeFields = ["company_code", "startdate", "enddate", "min", "max", "products", "user"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
      const startDateTime = new Date(req?.query?.startdate);
      startDateTime.setHours(0, 0, 0, 0);

      createdAt = {
        $gte: startDateTime ,
        $lte: new Date(req?.query?.enddate)
      };

      filter = { ...queryObj, createdAt };
    } else {
      createdAt = {};
      filter = { ...queryObj };
    }

    if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
      total = {
        $gte: req?.query?.min,
        $lte: req?.query?.max
      };
      filter = { ...filter, total };
    }

    if (req?.query?.products && req?.query?.products !== '') {
      filter = { ...filter, "products.product": req?.query?.products };
    }

    if (req?.query?.user && req?.query?.user !== "") {
      filter = { ...filter, customer: req?.query?.user };
    }

    const all = await bill.find(filter).sort({ createdAt: -1 }).populate({
      path: "customer",
      model: "customer",
    }).populate({
      path:"products.product",
      model:"products",
      populate:{
        path:"tax_persentage",
        model:"tax",
      }
    }).populate({
      path:"products.product",
      model:"products",
      populate:{
        path:"brand_id",
        model:"mastersettings",
      },
      populate:{
        path:"category_id",
        model:"mastersettings",
      }
      
    }).populate({
      path:"order_id",
      model:"order",
      populate:[
        {
          path:"products.category_id",
          model:"mastersettings",
         
        },
        {
          path:"products.brand_id",
          model:"mastersettings",
        }
      ] 
    }).exec();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const single = await bill.findOne({ _id: id }).populate({
      path:"customer",
      model:"customer",
    }).populate({
      path:"products.product",
      model:"products",
      populate:{
        path:"tax_persentage",
        model:"tax",
      }
    }).populate({
      path:"products.product",
      model:"products",
      populate:{
        path:"brand_id",
        model:"mastersettings",
      },
      populate:{
        path:"category_id",
        model:"mastersettings",
      }
      
    }).populate({
      path:"order_id",
      model:"order",
    }).exec();
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
})
module.exports = {
  getallBill,
  getSingleBill
}