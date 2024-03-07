const dailypricedetails = require('../../models/dailyprice');
const productiondetails = require('../../models/productiondetails');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");



    // created


const createdailypricedetails = asyncHandler(async (req, res) => {
  try {
      const create = await dailypricedetails.create(req.body);
      if (create) success(res, 201, true, "Created Successfully", create);
    } catch (error) {
      throw new Error(error);
    }
});;

    //getall

const getdailypricedetails = asyncHandler(async (req, res) => {
  const check = await dailypricedetails.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await dailypricedetails.find().populate({
      path: "product_details.brand_id",
      model: "mastersettings",
    }).populate({ path: "product_details.category_id", model: "mastersettings" }).exec();//.sort({ prie_details: -1 })
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

      //get using id
const getsingledailypricedetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await dailypricedetails.findOne({ _id: id });

  if (!check) throw new Error("Data not found");
  try {
    const single = await dailypricedetails.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});

      //update

const updatedailypricedetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await dailypricedetails.findOne({ _id: id });

const checkup1 = await productiondetails.findOne({ product_name: checkup.product_name });
const checkup2 = await (req.body.price_details[0].todays_price>0 )
if (!checkup2) throw new Error("Please enter valid price");
if (!checkup1) throw new Error("Data not found");
try {
   const newproductiondetails ={
     price:req.body.price_details[0].todays_price,
     date:req.body.price_details[0].date,
     status:true,
   }

var dublicateindex1=0;
if(checkup1["production_price_details"].length>0){
   dublicateindex1=checkup1["production_price_details"].findIndex((item)=>{
    item.price==newproductiondetails.date
   });

   checkup1["production_price_details"].forEach((item,index)=>{
    if(item.status==true){
      checkup1.production_price_details[index].status=false
    }
  });
  } else
  {
    dublicateindex1 = -1;
  }
    
   if(dublicateindex1!=-1){
checkup1.production_price_details[dublicateindex1]=newproductiondetails;
   } else {

     checkup1["production_price_details"].push(newproductiondetails);
        // console.log("rrrr=> "+checkup1["production_price_details"]);
     const update1 = await productiondetails.findByIdAndUpdate(checkup1._id, checkup1, { new: true });
      // console.log("update 1 =>> "+update1);
   }
  if (!checkup) throw new Error("Data not found");
  try {
   const  newPricedeails ={
     todays_price:req.body.price_details[0].todays_price,
     product_name:req.body.price_details[0].product_name,
     date:req.body.price_details[0].date,
     status:true,
   }
   const dublicateindex=checkup.price_details.findIndex((item)=>{
     item.todays_price==newPricedeails.date
   });   
    //change false or true
   checkup.price_details.forEach((item,index)=>{
    if(item.status==true){
      checkup.price_details[index].status=false
    }
  })
    if(dublicateindex!=-1){
        checkup.price_details[dublicateindex]=newPricedeails;
   } else {
     checkup.price_details.push(newPricedeails)
   }
      //sort by status
   checkup.price_details.sort((a,b)=>{
  if(a.status==true && b.status==false)
    return -1;
  if(a.status==false && b.status==true)
    return 1;
   })
   const update = await dailypricedetails.findByIdAndUpdate(id, checkup, { new: true });
   if (update) success(res, 200, true, "Update Successfully",update);
  } catch (error) {
    throw new Error(error);
  }
} catch (error) {
  throw new Error(error);
}
});

//delete
const deleteDailypricedetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await dailypricedetails.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await dailypricedetails.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createdailypricedetails,
  getdailypricedetails,
  getsingledailypricedetails,
  updatedailypricedetails,
  deleteDailypricedetails,
};