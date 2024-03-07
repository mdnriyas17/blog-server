const products = require('../../models/products');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const productiondetails = require("../../models/productiondetails");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

//getsingle
const getsingleProductMobile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await products.findOne({ _id: id });
  // console.log("check", check)
  if (!check) throw new Error("Data not found");
  try {
 const result = await products.findOne({ _id: id }).populate('brand_id category_id').exec();
    if (result) success(res, 200, true, "Get data successfully", result);

  } catch (error) {
    throw new Error(error);
  }
});


//getall
const getallProductMobile = asyncHandler(async (req, res) => {
  try {
    const all = await products.find({}).populate('brand_id category_id').exec();
    if (all) success(res, 200, true, "Get data successfully", all);
  } catch (error) {
    throw new Error(error);
  }
});

//getall

// const filterProduct = asyncHandler(async (req, res) => {
//   try {
//     // Filtering
//     const queryObj = { ...req.query };
//     const excludeFields = ["page", "sort", "limit", "fields",'q'];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     let query = productiondetails.find(JSON.parse(queryStr));
//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-createdAt");
//     }
//     // limiting the fields
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       query = query.select("-__v");
//     }
//     const page = req.query.page;
//     const limit = req.query.limit;
//     const skip = (page - 1) * limit;
//     query = query.skip(skip).limit(limit);
//     if (req.query.page) {
//       const productCount = await products.countDocuments();
//       if (skip >= productCount) throw new Error("This Page does not exists");
//     }
//     var product = await query;
    
//     if(req.query.q) {
//       function filterData(searchQuery) {
//       const query = searchQuery.toLowerCase();
//       const filteredData = product.filter(item => {
//         return item?.name.toLowerCase().includes(query);
//       });
//       return filteredData;
//       }
//       product = filterData(req.query.q.toLowerCase());
//     }
//     if (product) success(res, 200, true, "Get data successfully", product);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const filterProduct = asyncHandler(async (req, res) => {
//   try {
//     // Filtering
//     const queryObj = { ...req.query };
//     const excludeFields = ["page", "sort", "limit", "fields", "q"];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     let query = productiondetails.find(JSON.parse(queryStr));

//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-createdAt");
//     }

//     // Limiting the fields
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       query = query.select("-__v");
//     }

//     // Pagination
//     const page = req.query.page;
//     const limit = req.query.limit;
//     const skip = (page - 1) * limit;
//     query = query.skip(skip).limit(limit);

//     // Check if the requested page exists
//     if (req.query.page) {
//       const productCount = await productiondetails.countDocuments();
//       if (skip >= productCount) {
//         throw new Error("This Page does not exist");
//       }
//     }

//     // Fetch products
//     let products = await query;

//     // Search filter
//     if (req.query.q) {
//       products = filterData(products, req.query.q.toLowerCase());
//     }
    

//     // Response
//     sendResponse(res, 200, true, "Get data successfully", {
//       products,
 
//     });
//   } catch (error) {
//     sendResponse(res, 500, false, `Error: ${error.message}`);
//   }
// });

const filterProduct = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, sort, fields, q, minPrice, maxPrice, status } = req.query;
// console.log("req.query",req.query)
    // Build the find query
    let query = {};

    // Add search query if 'q' is provided
    if (q) {
      const regex = new RegExp(q, "i");
      query = {
        $or: [
          { product_name: regex },
          // Add more fields for search as needed
        ],
      };
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query["production_price_details.price"] = {};
      if (minPrice) query["production_price_details.price"].$gte = parseInt(minPrice);
      if (maxPrice) query["production_price_details.price"].$lte = parseInt(maxPrice);
    }

    // Add status filter
    if (status) {
      query["production_details.status"] = status;
    }

    // Build the sort query
    let sortQuery = {};
    if (sort) {
      sortQuery = sort.split(",").reduce((acc, field) => {
        const order = field.startsWith("-") ? -1 : 1;
        const key = field.replace(/^-/, "");
        acc[key] = order;
        return acc;
      }, {});
    }

    // Build the select (fields) query
    let selectQuery = {};
    if (fields) {
      const fieldsArray = fields.split(",");
      selectQuery = fieldsArray.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
    }

    const result = await productiondetails
      .find(query)
      .sort(sortQuery)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(result);
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { filterProduct };

function filterData(products, searchQuery) {
  const query = searchQuery.toLowerCase();
  return products.filter(
    (item) =>
      item?.product_name.toLowerCase().includes(query) ||
      (item.product_details[0]?.brand_name &&
        item.product_details[0].brand_name.toLowerCase().includes(query))
  );
}

function sendResponse(res, status, success, message, data = null) {
  res.status(status).json({
    success,
    message,
    data,
  });
}



module.exports = {
  getsingleProductMobile,
  getallProductMobile,
  filterProduct
};
