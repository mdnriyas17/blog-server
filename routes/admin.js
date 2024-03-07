const express = require("express");
const upload = require("../utils/upload");
const router = express.Router();
const { authAdmin , checkLogin } = require("../middlewares/authMiddlewares");



const {
  createMasterSettings,
  updateMasterSettings,
  deleteMasterSettings,
  getsingleMasterSettings,
  getallMasterSettings,
} = require("../controller/admin/masterSettings");
const {
  createUsers,
  loginAdmin,
  logoutAdmin,
  companyProfile,
  companyProfileGet
} = require("../controller/admin/adminusers");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getsingleProduct,
  getallProduct,
} = require("../controller/admin/products");

const {
  createMenus,
  updateMenus,
  deleteMenus,
  getsingleMenus,
  getallMenus,
} = require("../controller/admin/menus");
const {
  createTax,
  updateTax,
  deleteTax,
  getsingleTax,
  getallTax,
} = require("../controller/admin/tax");

const {
  updateOrderAdmin,
  getsingleOrderAdmin,
  getallOrderAdmin,
  updateManyOrderAdmin
} = require("../controller/admin/orderAdmin");

const {
  createDamgeType,
  updateDamgeType,
  deleteDamgeType,
  getsingleDamgeType,
  getallDamgeType,
} = require("../controller/admin/damageType");

const {
  getallAdminMenus,
 
} = require("../controller/admin/adminMenu");

const {
  createMasterUser,
  updateMasterUser,
  deleteMasterUser,
  getsingleMasterUser,
  getallMasterUser,
} = require("../controller/admin/masterUser");

const {
  createdailypricedetails,
  getdailypricedetails,
  getsingledailypricedetails,
  updatedailypricedetails,
  deleteDailypricedetails
} = require('../controller/admin/dailypricedetails');
const {
  createproductiondetails,
  getallproductiondetails,
  getsingleproductiondetails,
  updateproductiondetails,
  deleteproductiondetails,
}=require('../controller/admin/productiondetails');
const {
  createStaff,
  updateStaff,
  deleteStaff,
  getsingleStaff,
  getallStaff,
} = require('../controller/admin/staff');

const {
  createPage,
  updatePage,
  deletePage,
  getsinglePage,
  getallPage,
} = require('../controller/admin/pages');

const {
  getallDamageReport,
  updateDamageReport,
  getSingleDamageReport
} = require('../controller/admin/damageReport');

const {
  updateAccessStaff,
  createAccess,
  getSingleAccessStaff,
  getAllAccessStaff,
  getAllAccessMap,
  getSingleAccessStaffOne
} = require("../controller/admin/accessSettings");



const {
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getsingleDelivery,
  getallDelivery
} = require('../controller/mobile/delivery');

const {
  createDeliveryCharge,
  getallDeliveryCharge,
  getsingleDeliveryCharge,
  deleteDeliveryCharge,
  updateDeliveryCharge
} = require('../controller/admin/deliverycharge');

const {
  generateInvoice
} = require('../controller/admin/invoice');
const {
  getSingleBillInvoice,
} = require('../controller/admin/billinvoice');
const {
  getallBill,
  getSingleBill
} = require('../controller/admin/report');

const {
  getallAdminReport,
  createAdminReport
} = require('../controller/admin/adminreports');
const {
  getBillAndAdminReportData,
  getBillAndAdminReportDataById
} = require('../controller/admin/reportleger');
const {
  createBenner,
  updateBenner,
  deleteBenner,
  getsingleBenner,
  getallBenner
} = require('../controller/admin/benner');

const {
  getallPayment,
  getallPaymentEase
} = require('../controller/admin/payment');

const {
  customerSummery
} = require('../controller/admin/customersummery');

const {
  customerprint
} = require('../controller/admin/emailforcustomer');
//access middleware
router

.post("/thomasleo", authAdmin,upload.array("pdf"), customerprint)


.get("/billinvoice/:id",authAdmin, getSingleBillInvoice)
.post("/verifylogin", checkLogin)

.get("/customersummery", authAdmin, customerSummery)

//payament 
.get("/paymenteasebuzz/", authAdmin, getallPaymentEase)
.get("/payment/", authAdmin, getallPayment)

//Adminleager
.get("/adminledger", authAdmin, getBillAndAdminReportData)
.get("/adminledger/:id", authAdmin, getBillAndAdminReportDataById)


//adminreport

.post("/adminreport", authAdmin, createAdminReport)
.get("/adminreport", authAdmin, getallAdminReport)


//bill 
.get("/bill/", authAdmin, getallBill)
.get("/bill/:id", authAdmin, getSingleBill)

//benner
.get("/banners/:id", authAdmin, getsingleBenner)
.put("/banners/:id", authAdmin,upload.array("image"), updateBenner)
.delete("/banners/:id", authAdmin, deleteBenner)
.get("/banners/", authAdmin, getallBenner)
.post("/banners/", authAdmin,upload.array("image"), createBenner)


// delivery charge
.post("/delivery/", authAdmin, createDelivery)
.put("/delivery/:id", authAdmin, updateDelivery)
.delete("/delivery/:id", authAdmin, deleteDelivery)
.get("/delivery/:id", authAdmin, getsingleDelivery)
.get("/delivery/", authAdmin, getallDelivery)




///dailypricredetails
  .get("/dailypricedetails",authAdmin, getdailypricedetails)
  .post("/dailypricedetails",authAdmin, createdailypricedetails)
  .get("/dailypricedetails/:id",authAdmin, getsingledailypricedetails)
  .put("/dailypricedetails/:id",authAdmin, updatedailypricedetails)
  .delete("/dailypricedetails/:id",authAdmin, deleteDailypricedetails)

//production details

  .get("/productiondetails", authAdmin, getallproductiondetails)
  .get("/productiondetails/:id", authAdmin, getsingleproductiondetails)
  .put("/productiondetails/:id", authAdmin, updateproductiondetails)
  .delete("/productiondetails/:id", authAdmin, deleteproductiondetails)
  .post("/productiondetails/:id", authAdmin, createproductiondetails)

  //access settings
  
   .put("/accesssettings/:id", authAdmin, updateAccessStaff)
   .post("/accesssettings", authAdmin, createAccess)
   .get("/accesssettingsstaff/:id", authAdmin, getSingleAccessStaffOne)
   .get("/accesssettings/:id", authAdmin, getSingleAccessStaff)
   .get("/accesssettings", authAdmin, getAllAccessStaff)
   .get("/accesssettingsmap", authAdmin, getAllAccessMap)

  //damage
  .get("/damagereport", authAdmin, getallDamageReport)
  .get("/damagereport/:id", authAdmin, getSingleDamageReport)
  .put("/damagereport/:id", authAdmin, updateDamageReport)
  //pages add
  .post("/pages", createPage)
  .put("/pages/:id", updatePage)
  .delete("/pages/:id", deletePage)
  .get("/pages/:id", getsinglePage)// passing id
  .get("/page", getallPage)
  //staff add
  .post("/staff", authAdmin, createStaff)
  .put("/staff/:id", authAdmin, updateStaff)
  .delete("/staff/:id", authAdmin, deleteStaff)
  .get("/staff/:id", authAdmin, getsingleStaff)
  .get("/staff", authAdmin, getallStaff)
  //buyerlist
  .post("/buyerlist", authAdmin, createMasterUser)
  .put("/buyerlist/:id", authAdmin, updateMasterUser)
  .delete("/buyerlist/:id", authAdmin, deleteMasterUser)
  .get("/buyerlist/:id", authAdmin, getsingleMasterUser)
  .get("/buyerlist", authAdmin, getallMasterUser)
  //admin menu
  .get("/adminmenus", authAdmin, getallAdminMenus)
  
  //damagetype
  .post("/damagetype/",authAdmin, createDamgeType)
  .put("/damagetype/:id",authAdmin, updateDamgeType)
  .delete("/damagetype/:id",authAdmin, deleteDamgeType)
  .get("/damagetype/:id",authAdmin, getsingleDamgeType)
  .get("/damagetype/",authAdmin, getallDamgeType)
  //company profile
  .put("/companyprofile", authAdmin, upload.array("logo"),companyProfile)
  .get("/companyprofile", authAdmin, companyProfileGet)
  //order
  .put("/order/:id", updateOrderAdmin)
  .put("/order/", updateManyOrderAdmin)
  .get("/order/:id", getsingleOrderAdmin)
  .get("/order/", getallOrderAdmin)
  //tax
  .post("/tax/",authAdmin, createTax)
  .put("/tax/:id",authAdmin, updateTax)
  .delete("/tax/:id",authAdmin, deleteTax)
  .get("/tax/:id",authAdmin, getsingleTax)
  .get("/tax/",authAdmin, getallTax)
  //admin logins
  .post('/register/',createUsers)
  .post('/login/',loginAdmin)
  .put('/logout/',logoutAdmin)
  //master settings
  .post("/mastersettings/",authAdmin,upload.array("image"),authAdmin, createMasterSettings)
  .put("/mastersettings/:id",authAdmin,upload.array("image"),authAdmin, updateMasterSettings)
  .delete("/mastersettings/:id",authAdmin, deleteMasterSettings)
  .get("/mastersettings/:id",authAdmin, getsingleMasterSettings)
  .get("/mastersettings/",authAdmin, getallMasterSettings)
  //products
  .post("/product/",authAdmin,upload.array("image"),authAdmin, createProduct)
  .put("/product/:id",authAdmin,upload.array("image"),authAdmin, updateProduct)
  .delete("/product/:id",authAdmin, deleteProduct)
  .get("/product/:id",authAdmin, getsingleProduct)
  .get("/product/",authAdmin, getallProduct)
  
  //menus
  .post("/menus/",authAdmin,upload.array("icon"),authAdmin, createMenus)
  .put("/menus/:id",authAdmin,authAdmin,upload.array("icon"),updateMenus)//updateriyas
  .delete("/menus/:id",authAdmin, deleteMenus)
  .get("/menus/:id",authAdmin, getsingleMenus)
  .get("/menus/",authAdmin, getallMenus)

  //delivery charges

  .post("/deliverycharges/",authAdmin, createDeliveryCharge)
  .put("/deliverycharges/:id",authAdmin, updateDeliveryCharge)
  .delete("/deliverycharges/:id",authAdmin, deleteDeliveryCharge)
  .get("/deliverycharges/:id",authAdmin, getsingleDeliveryCharge)
  .get("/deliverycharges/",authAdmin, getallDeliveryCharge)

   // invoice 
   .get("/invoice/:id",authAdmin,generateInvoice)
  
module.exports = router;
