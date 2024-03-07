const axios = require("axios");
const asyncHandler = require("express-async-handler");
const gp1 = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=";
const gp2 = "&destinations=";
const gp3 = "&units=imperial&key=";
const company = require("../models/company");
const delivery = require("../models/deliverycharge");

// const getallDeliveryCharge = asyncHandler(async (req, res) => {
//   const delivery_charge = await delivery.find();
//   if (delivery_charge) {
//     success(res, 200, true, "Delivery Charge", delivery_charge);
//   }
// })

// const delivery_charge = getallDeliveryCharge();
const getDeliveryCharge = asyncHandler(async (city) => {
  const delivery_charge = await delivery.find({status: true});
  const delivery_price = delivery_charge[0].delivery_charge;
  const company_location = await company.findOne({ admin_id: "648080de0feb907d4eeb4c37" });
  let buyerAddress = company_location?.city;
  let pincode = city;
  let kms;

  try {
    const config = {
      method: "get",
      url: `${gp1}${buyerAddress}${gp2}${pincode}${gp3}${"AIzaSyCTUjetIsCddN0oXpesn8Ba-lVjsMTTdjQ"}`,
      headers: {},
    };

    await axios(config)
      .then((response) => {
        let distance = JSON.stringify(
          response.data.rows[0].elements[0].distance.text
        );
        let str = distance;
        str = str.slice(1, -4);
        str = parseFloat(str.replace(/,/g, ""));
        kms = str * 1.60934;
        kms = kms.toString();
        kms = Math.round(kms);
      })
      .catch(function (error) {
        throw new Error(error);
      });

    // Check if distance is within 20km
    if (kms <= 50) {
      return 0; // No delivery charge
    } else {
      return kms*delivery_price; // Return the calculated distance as the delivery charge
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getDeliveryCharge,
};
