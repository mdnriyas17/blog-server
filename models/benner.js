const mongoose  = require("mongoose");

const benner = new mongoose.Schema({
  banner_name:{
    type:String,
    required:true
  },
    banner_head:{
      type:String,
      required:true
    },
  banner_text:{
    type:String,
    required:true
  },
  banner_link:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    default:true
  },
  created_date_time: {
    type: Date,
    default: Date.now(),
  },
},
{
  timestamps:true,
  versionKey:false  
})

module.exports = mongoose.model("benner",benner)