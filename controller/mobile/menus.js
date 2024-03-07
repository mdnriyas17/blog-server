const menus = require('../../models/menus');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");

//getall
const getallMenus = asyncHandler(async (req, res) => {
  try {
    const all = await menus.find(req.query);
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getallMenus,
};