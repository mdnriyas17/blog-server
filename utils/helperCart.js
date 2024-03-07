// const cart = require("../models/cart");
// const tax = require("../models/tax");
// const productiondetails = require("../models/productiondetails");
// const {getDeliveryCharge} = require("../utils/distanse");
// const helperCart = async (req) => {
//   const verifyCart = await cart.find(req.query).populate({
//     path: "product_id customer_id",
//   });

//   const cartIdsToDelete = verifyCart
//     .filter((item) => item == null)
//     .map((item) => item?._id);
//   await cart.deleteMany({ _id: { $in: cartIdsToDelete } });

//   const all = await cart
//     .find(req.query)
//     .populate({ path: "product_id customer_id" })
//     .exec();

//  const res = await getDeliveryCharge(verifyCart[0]?.customer_id?.city);
// // console.log("res",res);
//   const data = await Promise.all(
//     all.map(async (item) => {
//       const prospec = await productiondetails.findOne({
//         _id: item?.product_id,
//       });
//       var filt = [];
//       const productspec = item?.productspec_id;
// console.log("prospec",prospec.production_details);
// const ids = prospec.production_details.map((item) => item);
// for(i=0;i<ids.length;i++){
//   if(ids[i]["_id"].toString()==productspec.toString()){
//    filt.push(ids[i]);
//   }
// }
// // console.log("filt",ids);
//       const lastIndex = prospec.production_price_details.length - 1;
//       const sp = prospec.production_price_details[lastIndex].price;
//       const taxGet = await tax.findOne({
//         _id: item?.product_id?.tax_persentage,
//       });

//       const tax11 = taxGet?.tax_percentage;
//       const { product_id } = item;
//       const { qty } = item;
//       const kg = filt[0]["kg"]; //kg will static
//       const city = item?.customer_id?.city;

//       const priceCalculation = (qty, sp, kg) =>
//         Math.round(Number((kg * (sp || 0) * qty)));
//       const taxCalculation = (qty, sp, kg, tax11) =>
//         Math.round(
//           Number(((kg * (sp || 0) * qty * (tax11 || 0))) / 100)
//         );

//       return {
//         _id: item?._id,
//         customer: item?.customer_id,
//         product_id,
//         qty,
//         sp,
//         kg,
//         tax_persentage: tax11,
//         tax: taxCalculation(qty, sp, kg, tax11),
//         amount: priceCalculation(qty, sp, kg),
//       };
//     })
//   );

//   const { total_quantity, total_tax, total_amount, total_kg } = data.reduce(
//     (totals, item) => {
//       totals.total_quantity += item.qty;
//       totals.total_tax += item.tax;
//       totals.total_amount += item.amount;
//       totals.total_kg += item.kg;
//       return totals;
//     },
//     { total_quantity: 0, total_tax: 0, total_amount: 0, total_kg: 0 }
//   );

//   const cart_item = data.map((item) => ({
//     ...item,
//     prospec: item.prospec || "",
//   }));
// // console.log("cart_item",data);
//   const obj = {
//     cart_item,
//     total_item: cart_item.length || 0,
//     total_quantity,
//     total_kg,
//     total_amount_before_tax: total_amount,
//     total_tax,
//     delivery_charge: res,
//     total_amount: total_amount + total_tax + res,
//   };

//   return obj;
// };

// module.exports = { helperCart };

const cart = require("../models/cart");
const tax = require("../models/tax");
const productiondetails = require("../models/productiondetails");
const { getDeliveryCharge } = require("../utils/distanse");
const delivery_address = require("../models/deliveryAddress");
const emailsender = require("../utils/email");
const helperCart = async (req) => {
  const verifyCart = await cart.find(req.query).populate({
    path: "product_id customer_id",
  });
  const cartIdsToDelete = verifyCart
    .filter((item) => item == null)
    .map((item) => item?._id);
  await cart.deleteMany({ _id: { $in: cartIdsToDelete } });
  const all = await cart
    .find(req.query)
    .populate({ path: "product_id customer_id" })
    .exec();
  if (all.length === 0) {
    return {
      cart_item: [],
      total_item: 0,
      total_quantity: 0,
      total_kg: 0,
      total_amount_before_tax: 0,
      total_tax: 0,
      delivery_charge: 0,
      total_amount: 0,
    };
  }
  const defaultAddress = await delivery_address.find({
    customer_id: verifyCart[0]?.customer_id,
    is_default_address: true,
  });
  const res = await getDeliveryCharge(defaultAddress[0]?.city);
  // console.log("res",res);
  // const res = 0;
  const data = await Promise.all(
    all.map(async (item) => {
      const prospec = await productiondetails.findOne({
        _id: item?.product_id,
      });
      var filt = [];
      const productspec = item?.productspec_id;

      const ids = prospec.production_details.map((item) => item);
      for (let i = 0; i < ids.length; i++) {
        if (ids[i]["_id"].toString() == productspec.toString()) {
          filt.push(ids[i]);
        }
      }

      const lastIndex = prospec.production_price_details.length - 1;
      const sp = prospec.production_price_details[lastIndex].price;
      const taxGet = await tax.findOne({
        _id: item?.product_id?.tax_persentage,
      });

      const tax11 = taxGet?.tax_percentage;
      const { product_id } = item;
      const { qty } = item;
      const kg = filt[0]["kg"]; //kg will static
      const city = item?.customer_id?.city;
      const default_margin = item?.product_id.default_margin;
      const priceCalculation = (qty, sp, kg, default_margin) =>
        Math.round(Number(kg * (sp * (default_margin / 100) + sp) * qty));
      const taxCalculation = (qty, sp, kg, tax11, default_margin) =>
        Number(
          (kg * (sp * (default_margin / 100) + sp) * qty * (tax11 || 0)) / 100
        );
      const marginCalculation = (default_margin, sp) =>
        Number(sp * (default_margin / 100));

      return {
        _id: item?._id,
        customer: item?.customer_id,
        product_id,
        default_margin,
        qty,
        sp: marginCalculation(default_margin, sp) + sp,
        price: sp,
        kg,
        tax_persentage: tax11,
        margin: marginCalculation(default_margin, sp),
        tax: taxCalculation(qty, sp, kg, tax11, default_margin),
        amount: priceCalculation(qty, sp, kg, default_margin),
        prospec: filt.length ? filt[0] : "", // Store matching details in prospec
      };
    })
  );
  const { total_quantity, total_tax, total_amount, total_kg, default_margin } =
    data.reduce(
      (totals, item) => {
        totals.total_quantity += item.qty;
        totals.total_tax += item.tax;
        totals.default_margin;
        totals.total_amount += item.amount;
        totals.total_kg += item.kg;
        return totals;
      },
      {
        total_quantity: 0,
        total_tax: 0,
        total_amount: 0,
        total_kg: 0,
        default_margin: 0,
      }
    );

  const cart_item = data.map((item) => ({
    ...item,
    prospec: item.prospec || "",
  }));

  const obj = {
    cart_item,
    total_item: cart_item.length || 0,
    default_margin,
    total_quantity,
    total_kg,
    total_amount_before_tax: total_amount,
    total_tax,
    delivery_charge: res,
    total_amount: total_amount + total_tax + res,
  };
  return obj;
};

module.exports = { helperCart };
