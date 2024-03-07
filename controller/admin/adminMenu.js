// const adminmenus = require('../../models/adminMenu');
// // const accesssettings = require('../../models/accessSettings');
// // const staff = require("../../models/staff");
// const asyncHandler = require("express-async-handler");
// const { success } = require("../../utils/response");
// // const adminusers = require('../../models/adminUser');
// const { access_permission } = require('../../utils/init');

// //getall
// const getallAdminMenus = asyncHandler(async (req, res) => {
//   try {
//     const menus = await adminmenus.find();
//     // console.log("req",req.role)
//     if (req.role === "admin") {
//       const adminmenu = [];
//       menus.map(menu => {
//         adminmenu.push({
//           module: menu.module,
//           url: menu.url,
//           menuname: menu.name,
//           parent_id: menu.parent_id,
//           options: ['add','edit','view','delete','print','excel','download','pdf','update'],
//           _id: menu._id
//         });
//       })
//       success(res, 200, true, "Get data successfully", adminmenu);
//     }
//      else if (req.role === "staff") {
//       // console.log("staff",access_permission)
//       const menu = access_permission
//         .filter(access => access.options.length > 0)
//         .map(access => {
//           const filteredMenus = menus.find(menu => menu.module.includes(access.module));
//           return {
//             module: access.module,
//             url: filteredMenus?.url,
//             menuname: filteredMenus?.name,
//             parent_id: filteredMenus?.parent_id,
//             options: access.options,
//             _id: filteredMenus?._id
//           };
//         });
//         // console.log("menu",menu)
//         for(let i = 0; i < menu.length; i++){
//           let main1 = "64a283b0a7e61ae4da21954f";
//           let main2 = "64a28440a7e61ae4da21956a";
//           let main3 = "64a284b5a7e61ae4da21957c";
//           let main4 = "65167e543a54dfe390a8a113";
//           let main5 = "651696e33a54dfe390a8a134";
//           const menu1check = menu.find(menu => menu._id === main1);
//           const menu2check = menu.find(menu => menu._id === main2);
//           const menu3check = menu.find(menu => menu._id === main3);
//           const menu4check = menu.find(menu => menu._id === main4);
//           const menu5check = menu.find(menu => menu._id === main5);
//           if(main1.includes(menu[i].parent_id) && !menu1check){
//             menu.push({
//               module: "prerequisites",
//               url: null,
//               menuname: "Pre-Requisites",
//               parent_id: null,
//               options: [],
//               _id:main1,
//             })
//           } else if(main2.includes(menu[i].parent_id) && !menu2check){
//             menu.push({
//               module: "productmain",
//               url: null,
//               menuname: "Products",
//               parent_id: null,
//               options: [],
//               _id:main2,
//             })
//           } else if(main3.includes(menu[i].parent_id) && !menu3check){
//             menu.push({
//               module: "ordersmain",
//               url: null,
//               menuname: "Orders",
//               parent_id: null,
//               options: [],
//               _id:main3,
//             })
//           } else if(main4.includes(menu[i].parent_id) && !menu4check){
//             menu.push({
//               module: "damage",
//               url: null,
//               menuname: "Damage",
//               parent_id: null,
//               options: [],
//               _id:main4,
//             })
//           } else if(main5.includes(menu[i].parent_id) && !menu5check){
//             menu.push({
//               module: "mobilemenu",
//               url: "/mobilemenu",
//               menuname: "Mobile Menu",
//               parent_id: null,
//               options: [],
//               _id:main5,
//             })
//           }

//         }

//       success(res, 200, true, "Get data successfully", menu);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });
//getall
// const singleAdminMenus = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   const check = await adminmenus.findOne({ _id: id });
//   console.log("check", check);
//   if (!check) throw new Error("Data not found");
//   try {
//     const single = await accesssettings.findOne({ _id: id });
//     if (single) success(res, 200, true, "Get data successfully", single);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// module.exports = {
//   getallAdminMenus,
//   // singleAdminMenus,
// };

const adminmenus = require("../../models/adminMenu");
const accesssettings = require("../../models/accessSettings");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const { menu } = require("../../utils/init");

//getall

const getallAdminMenus = asyncHandler(async (req, res) => {
  try {
    const menus = await menu
    // console.log('menus',menus)
    const result = [];
    for (let i = 0; i < menus.length; i++) {
      result.push({
        module: menus[i].module,
        url: menus[i].url,
        menuname: menus[i].name,
        parent_id: menus[i].parent_id,
        options: [
          "add",
          "edit",
          "view",
          "delete",
          "print",
          "excel",
          "download",
          "pdf",
          "update",
        ],
        _id: menus[i]._id,
      });
    }
    success(res, 200, true, "Get data successfully", result);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getallAdminMenus,
};
