const adminuser = require('../../models/adminUser');
const company = require('../../models/company');
const {admin_init,menu} = require('../../utils/init');
const adminmenus = require('../../models/adminMenu');
const asyncHandler = require("express-async-handler");
//admin login
const initAdmin = asyncHandler(async ()=>{
  if(await adminuser.countDocuments()<1) {
    const create_admin = await adminuser.create(admin_init);
    await company.create({admin_id:create_admin?._id});
  };
  if(await adminmenus.countDocuments()<1) {
    await adminmenus.insertMany(menu);
  };
});

module.exports = {
  initAdmin
};