const mongoose = require("mongoose");

var productiondetails = new mongoose.Schema(
  {
    product_name: {
      type: String,
      // required: true,
      trim: true,
      ref:"products"
    },
    product_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"products",
    },
 production_price_details:[
   {
     
    price:{
      type:Number,
      required:true,
     
    },
    date:{
      type:String,
      required:true,

    },status:{
      type:Boolean,
      default:true,
    }
   }
 ],
    product_details:[{
      brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"product",
        default:null,
        required:true,
      },
      category_id: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"product",
        default:null,
        required:true,
      },
      brand_name: {
        type: String,
        // required: true,
        trim: true,
        ref:"product"
      },
      category_name: {
        type: String,
        // required: true,
        trim: true,
        ref:"product"
      },
      name: {
        type: String,
        unique:true,
        trim:true,
        required:true,
      },
      description: {
        type: String,
        default:null,
        required:true,
      },
      image: {
        type:[String],
        default:null
      },
      tax_persentage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tax",
        required:true,
      },
      default_margin:{
        type:Number,
        required:true,
      },
      // mrp:{
      //   type:Number,
      //   trim:true,
      //   required:true,
      // }, 
      // sp: {
      //   type:Number,
      //   trim:true,
      //   required:true,
      // },
      // avalible_box:{
      //   type:Number,
      //   required:true,
      // },
      sku:{
        type:String,
        unique:true,
      },
      // box_quantity:[
      //   {
      //     kg:{
      //       type:Number,
      //       required:true,
      //     },
      //     avalible_box:{
      //       type:String,
      //       required:true, 
      //     },
      //   }
      // ],
      status: {
        type:Boolean,
        default:true,
      },
      done_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'admins',
      },
      created_date_time: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
    ],
    production_details:[
      {
        kg:{
          type:Number,
          required:true,
        },
        qty:{
          type:Number,
          required:true,
        },
        createdAt:{
          type:Date,
          default: Date.now(),
          required: true,
        },
        updatedAt:{
          type:Date,
          required: true,
          default: Date.now()
        },
      }
    ]

  }
)

module.exports = mongoose.model("production", productiondetails);



// const mongoose = require("mongoose");

// var productiondetails = new mongoose.Schema(
//   {
//         product_name: {
//           type: String,
//           required: true,
//           trim: true,
//           unique: true
//         },
//         production_details:[
//           {
//             kg:{
//               type:Number,
//               required:true,
//             },
//             qut:{
//               type:Number,
//               required:true,
//             }
//           }
//   ]
// },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// module.exports = mongoose.model("production", productiondetails);

// // let Schema = mongoose.Schema;

// // var dailypricedetails = new mongoose.Schema(
// //   {
// //     product_name: {
// //       type: String,
// //       ref:"product",//name from products
// //       required: true,
// //       trim: true,
// //       unique: true
// //     },
// // price_details:[
// //   {
// //     userid: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref:"product_name",
// //     },
// //     todays_price:{
// //       type: Number,
// //       required: true,
// //     },
// //     product_name: {
// //       type: String,  
// //       ref:"product",
// //       required: true,
// //       trim: true,
// //       unique: true
// //     },
// //     date:{
// //       type: String,
// //       required: true,
// //     },

// //     status:{
// //       type:Boolean,
// //       default:true,
// //     },
   
// //     createdAt:{
// //       type:Date,
// //       default: Date.now(),
// //       required: true,
// //     },
// //     updatedAt:{
// //       type:Date,
// //       required: true,
// //       default: Date.now()
// //     },
  
// //   },
// // ]
// //   });

// // module.exports = mongoose.model("dailyprice", dailypricedetails);
// //