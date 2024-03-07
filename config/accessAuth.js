const asyncHandler = require("express-async-handler");
// const accesssettings = require("../../models/accessSettings");

//auth access for all staff
const authAccess = (menu, option, type) =>
  asyncHandler(async (req, res, next) => {
    console.log("menu", menu);
    console.log("permission", option);
    console.log("type", type);
    if (req.role === "admin" || req.role === "superadmin") {
      next();
    } else {
      res.status(200).json({
        "access_permission": "permission"
      });
      // const getAllMenus = await accesssettings.findOne({
      //   staff_id: req?.staff?._id,
      // });
      // if (getAllMenus && getAllMenus?.access_permission?.includes(menu)) {
      //   next();
      // } else {
      //   throw new Error("Not access this resources");
      // }
    }
  });

module.exports = {
  authAccess,
};
