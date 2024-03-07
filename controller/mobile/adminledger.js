const damage = require("../../models/damages");
const adminreport = require("../../models/adminreports");
const order = require("../../models/order");
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
//getall


const getBillAndAdminReportData = asyncHandler(async (req, res) => {
  try {
    const result = await damage.aggregate([
      {
        $lookup: {
          from: "adminreports",
          localField: "order_id",
          foreignField: "bill_id",
          as: "adminreport",
        },
      },
    ]);
    const orderIds = result.map((item) => item.order_id);
    const populatedResult = await order.find({ _id: { $in: orderIds } });
    const combinedResult = result.map((item) => {
      const orderDetails = populatedResult.find((orderItem) =>
        orderItem._id.equals(item.order_id)
      );
      return {
        orderDetails,
        ...item,
      };
    });
    const finalResult = combinedResult.map((item) => ({
      ...item,
      admin_damage_message: undefined,
      admin_damage_status: undefined,
    }));

    if (finalResult) {
      success(res, 200, true, "Get data successfully", combinedResult);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data');
  }
});


  

module.exports = {
  getBillAndAdminReportData,
}