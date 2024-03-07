const delivery = require('../../models/delivery');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
// const { DeliveryCharge } = require('../../config/deliverChageCalculation');
const axios = require("axios");
const gp1 = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=";
const gp2 = "&destinations=";
const gp3 = "&units=imperial&key=";


//create
const createDelivery = asyncHandler(async (req, res) => {
  try {
    const create = await delivery.create(req.body);
    if (create) success(res, 201, true, "Created Successfully", create);
  } catch (error) {
    throw new Error(error); 
  }
});
//update
const updateDelivery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const checkup = await delivery.findOne({ _id: id });
  if (!checkup) throw new Error("Data not found");
  try {
    const updateAccess = await delivery.findByIdAndUpdate(id, req.body, { new: true });
    if (updateAccess) success(res, 200, true, "Update Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//delete
const deleteDelivery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await delivery.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const remove = await delivery.findByIdAndDelete(id);
    if (remove) success(res, 200, true, "Deleted Successfully");
  } catch (error) {
    throw new Error(error);
  }
});
//getsingle
const getsingleDelivery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await delivery.findOne({ _id: id });
  if (!check) throw new Error("Data not found");
  try {
    const single = await delivery.findOne({ _id: id });
    if (single) success(res, 200, true, "Get data successfully", single);
  } catch (error) {
    throw new Error(error);
  }
});
//getall
const getallDelivery = asyncHandler(async (req, res) => {
  const check = await delivery.find().countDocuments();
  if (check===0) throw new Error("Data not found");
  try {
    const all = await delivery.find();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});
//  get DeliveryCahrge
 const getDeliveryCharge = asyncHandler(async (req, res) => {
     let data1 = await delivery.find();
    //  console.log(data1)
     let buyeraddress = "Chennai";
     let pincode = "Coimbatore";  
     try {
       const config = {
         method: "get",
         url: `${gp1}${buyeraddress}${gp2}${pincode}${gp3}${"AIzaSyCTUjetIsCddN0oXpesn8Ba-lVjsMTTdjQ"}`,
         headers: {},
       };
       await axios(config)
         .then((response) => {
           let distance = JSON.stringify(
             response.data.rows[0].elements[0].distance.text
           );
           let str = distance;
           // str = str.substring(0, str.length -3);
           // str = str.slice(0, 1)
           str = str.slice(1, -4);

           str = parseFloat(str.replace(/,/g, ""));
           let kms = str * 1.60934;
           kms = kms.toString();
           kms = Math.round(kms);

           let dist;
           if (kms <= 100) {
             dist = "Local";
           } else if (kms >= 101 && kms <= 200) {
             dist = "Upto200Kms";
           } else if (kms >= 201 && kms <= 1000) {
             dist = "Kms201_1000";
           } else if (kms >= 1001 && kms <= 2000) {
             dist = "Kms1001_2000";
           } else if (kms >= 2001) {
             dist = "Above2000Kms";
           }

           let weight = 1;
           if (weight == "" || weight == null) {
             return res.send("Undefined");
           }
           let nameArray = data1.map(async function (el) {
             return await el.VolumeEnd;
           });
           const closest = nameArray.reduce((a, b) => {
             return Math.abs(a - weight) < Math.abs(b - weight) ? a : b;
           });
           var result = data1.find(
             async (item) => (await item.VolumeEnd) == closest
           );
           return  res.send (result[dist]);
         })
         .catch(function (error) {
              throw new Error(error);
         });
     } catch (err) {
       throw new Error(err);
     }
  
  
 });

module.exports = {
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getsingleDelivery,
  getallDelivery,
  getDeliveryCharge,
};