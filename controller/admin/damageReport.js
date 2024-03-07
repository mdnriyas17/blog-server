const damages = require('../../models/damages');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const orders = require("../../models/order");
const orderslogs = require("../../models/orderLogs");
const paymentinfo = require("../../models/paymentInfo");
const paymentResponseLogs = require("../../models/paymentResponseLogs");
const validateId = require("../../utils/validateId");
//getall
// const getallDamageReport = asyncHandler(async (req, res) => {
//   let options = {};
//   let createdAt;
//   let products;
//   let total;
//   let filter;
//   const queryObj = { ...req.query };
//   const excludeFields = ["company_code","startdate","enddate","min","max","products","user"];
//   excludeFields.forEach((el) => delete queryObj[el]);
//   if(req?.query?.startdate && req?.query?.enddate && req?.query?.startdate!="" && req?.query?.enddate!="") {
//     createdAt =  {
//       $gte: new Date(req?.query?.startdate).getDate() -1,
//       $lte: new Date(req?.query?.enddate)
//     };
    
//     filter = {...queryObj,createdAt}
    
//     } else {
//       createdAt =  {}
//       filter = {...queryObj}
      
//     } 
//     if(req?.query?.min && req?.query?.max && req?.query?.min!="" && req?.query?.max!="") {
//       total = {
//         $gte: req?.query?.min,
//         $lte: req?.query?.max
//       }
//       filter = {...filter,total}
//     }
//     if(req?.query?.products && req?.query?.products!='') {
//       filter = {...filter,"products.product":req?.query?.products}
//     }
//     if(req?.query?.user && req?.query?.user!="") {
//       filter = {...filter,customer:req?.query?.user}
//     }
//   const check = await damages.find(filter).countDocuments();
//   if (check===0) throw new Error("Data not found");
//   try {
//     const all = await damages.find(filter).populate({
//       path: "order_id",
//       model: "order",
//     }).populate({
//       path: "customer_id",
//       model: "customer",
//     }).populate({
//       path: "damage_type",
//       model: "damagetype",
//     });
//     if (all) {
//       success(res, 200, true, "Get data successfully", all);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
  
// });
const getallDamageReport = asyncHandler(async (req, res) => {
  try {
    let options = {};
    let createdAt;
    let products;
    let total;
    let filter;
    let queryObj = { ...req.query }; // Declare queryObj here
if (req?.query?.startdate && req?.query?.enddate && req?.query?.startdate !== "" && req?.query?.enddate !== "") {
  const startDateTime = new Date(req?.query?.startdate);
  startDateTime.setHours(0, 0, 0, 0);

  createdAt = {
    $gte: startDateTime,
    $lte: new Date(req?.query?.enddate),
  };

  filter = { ...filter, createdAt };
}

if (req?.query?.min && req?.query?.max && req?.query?.min !== "" && req?.query?.max !== "") {
  total = {
    $gte: req?.query?.min,
    $lte: req?.query?.max,
  };
  filter = { ...filter, total };
}

if (req?.query?.products && req?.query?.products !== "") {
  filter = { ...filter, "products.product": req?.query?.products };
}

if (req?.query?.user && req?.query?.user !== "") {
  filter = { ...filter, "customer_id": req?.query?.user };
}
    const all = await damages.find(filter).sort({ createdAt: -1 }).populate({
      path: "order_id",
      model: "order",
      populate: [
        {
          path: "products.category_id",
          model: "mastersettings",
        },
        {
          path: "products.brand_id",
          model: "mastersettings",
        }
      ]
    }).populate({
      path: "customer_id",
      model: "customer",
    }).populate({
      path: "damage_type",
      model: "damagetype",
    })
// console.log(all)
    if (all) {
      success(res, 200, true, "Get data successfully", all);
    }
  } catch (error) {
    throw new Error(error);
  }
});


//getall
const getSingleDamageReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await damages.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const all = await damages.findOne({ _id: id }).populate({
      path: "order_id",
      model: "order",
      populate: [
        {
          path: "products",
          model: "product",
        },
        {
          path: "products.category_id",
          model: "mastersettings",
        },
        {
          path: "products.brand_id",
          model: "mastersettings",
        },
      ],
    }).populate({
      path: "customer_id",
      model: "customer",
    }).populate({
      path: "damage_type",
      model: "damagetype",
    });
    if (all) {
      success(res, 200, true, "Get data successfully", all);
    }
    console.log(all)  
  } catch (error) {
    throw new Error(error);
  }
  
});
//update report
const updateDamageReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkupexsist = await damages.findOne({ _id: id,admin_status:true });
  const checkup = await damages.findOne({ _id: id });
  if (checkupexsist) throw new Error("Report already updated!");
  if (!checkup) throw new Error("Data not found");
  if(req?.body?.admin_damage_status=="" || !req?.body?.admin_damage_status) {
    throw new Error("Damage status is required");
  }
  // if(req?.body?.admin_damage_message=="" || !req?.body?.admin_damage_message) {
  //   throw new Error("Damage message is required");
  // }
  let form_data = {
    admin_damage_status:req?.body?.admin_damage_status,
    admin_damage_message:req?.body?.admin_damage_status,//req?.body?.admin_damage_message,  
    admin_status:true,
  }
  try {
    const orderlogs = await orderslogs.create({
      order_id:checkup?.order_id,
      order_status:req?.body?.admin_damage_status,
      message:req?.body?.admin_damage_status,
      status:true,
      done_by:req?.user?._id
    })
    const order = await orders.findByIdAndUpdate(checkup?.order_id, {
      $set: {
        order_status:req?.body?.admin_damage_status
      }
    })
    const update = await damages.findByIdAndUpdate(id, form_data, { new: true });
    const create1 = await orderslogs.create(orderlogs);
    if (update) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = {
  getallDamageReport,
  updateDamageReport,
  getSingleDamageReport
};