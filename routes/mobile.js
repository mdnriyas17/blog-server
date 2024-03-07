const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middlewares/authMiddlewares");
const upload = require("../utils/upload");


const {
  createMasterUser,
  loginMasterUser,
  logoutMasterUser,
  updateMyProfile,
  getsingleProfile,
  otpwithlogin,
  verifyMethod,
  companyProfileMobile
} = require("../controller/mobile/customer");

const {
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getsingleDeliveryAddress,
  getallDeliveryAddress,
  updateDeliveryAddressDefault,
} = require("../controller/mobile/deliveryAddress");

const {
  getSingleMasterSettingsMobile,
  getAllMasterSettingsMobile
} = require("../controller/mobile/masterSettings");

const {
  getsingleProductMobile,
  getallProductMobile,
  filterProduct
} = require("../controller/mobile/products");

const {
  getallMenus
} = require("../controller/mobile/menus");

const {
  createCart,
  updateCart,
  deleteCart,
  getallCart,
  deletenam
} = require("../controller/mobile/cart");

const {
  createPaymentInfo,
  failure,
  successPayment,
} = require("../controller/mobile/paymentInfo");
  
const {
  getSingleOrder,
  getAllOrder
} = require("../controller/mobile/order");

const {
  createDamageReport
} = require("../controller/mobile/damageReport");

const {
  getallDamgeType,
} = require("../controller/mobile/damageType");

const {
  createproductiondetails,
  updateproductiondetails,
  deleteproductiondetails,
  getsingleproductiondetails,
  getallproductiondetails,
}=require('../controller/mobile/productiondetails');

const {
  createPage,
  updatePage,
  deletePage,
  getsinglePage,
  getallPage,
} = require('../controller/mobile/pages');

const {
  getallDeliveryCharge,
  getSingleDeliveryCharge
} = require('../controller/mobile/deliverycharge');

const {
  getallBenner
} = require('../controller/mobile/benner');

const {
  getallSummary
} = require('../controller/mobile/customersummary');
router

//benner 
.get("/banner", getallBenner)
.get("/summary", getallSummary)
//delivery charge
.get("/deliverycharge", getallDeliveryCharge)
.get("/deliverycharge/:id", getSingleDeliveryCharge)

    //production details

    .get("/productiondetails",  getallproductiondetails)
    .get("/productiondetails/:id",  getsingleproductiondetails)
    .put("/productiondetails/:id",  updateproductiondetails)
    .delete("/productiondetails/:id",  deleteproductiondetails)
    .post("/productiondetails/:id",  createproductiondetails)


    //pages add

    .post("/pages", createPage)
    .put("/pages/:id", updatePage)
    .delete("/pages/:id", deletePage)
    .get("/pages", getsinglePage)
    .get("/page", getallPage)

    //damagetype

    .get("/damagetype", getallDamgeType)

    //company profile

    .get("/companyprofile", companyProfileMobile)

    // damage api

    .post("/damage/",authAdmin,upload.array('images'),authAdmin, createDamageReport)

    //otp

    .post("/otplogin/", otpwithlogin)
    .post("/verify/", verifyMethod)

    //order

    .get("/order/:id",authAdmin, getSingleOrder)
    .get("/order/",authAdmin, getAllOrder)

    //cart

    .post("/payment/",authAdmin, createPaymentInfo)
    .post("/paymentinfo/failure/", failure)
    .post("/paymentinfo/success/", successPayment)

    //cart

    .post("/cart/",authAdmin, createCart)
    .put("/cart/:id",authAdmin, updateCart)
    .delete("/cart/:id",authAdmin, deleteCart)
    .get("/cart/",authAdmin, getallCart)
    .delete("/cartall/", deletenam)

    //customer register

    .post("/register/", createMasterUser) 
    .post("/login/", loginMasterUser)
    .put("/logout/", logoutMasterUser)
    .put('/updateprofile/', authAdmin,upload.array('image'),updateMyProfile)//authadim edit profile
    .get('/profile/',authAdmin,getsingleProfile)
    .get('/mastersettings/:id',getSingleMasterSettingsMobile)
    .get('/mastersettings/',getAllMasterSettingsMobile)

    //delivery address

    .post("/deliveryaddress/",authAdmin, createDeliveryAddress)
    .put("/deliveryaddress/:id",authAdmin, updateDeliveryAddress)
    .put("/deliveryaddressdefault/:id",authAdmin, updateDeliveryAddressDefault)
    .delete("/deliveryaddress/:id",authAdmin, deleteDeliveryAddress)
    .get("/deliveryaddress/:id",authAdmin, getsingleDeliveryAddress)
    .get("/deliveryaddress/",authAdmin, getallDeliveryAddress)
   

    //product

    .get("/product/:id",getsingleProductMobile)
    .get("/product/",getallProductMobile)
    .get("/filter/",filterProduct)

    //menus

    .get("/menus/",getallMenus)
  


module.exports = router;