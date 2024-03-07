const mongoose = require("mongoose");


var customer = new mongoose.Schema(
  {
    company_name: {
      type: String,
    },
    company_gst: {
      type: String,
    },
    customer_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 15,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique:true,
      trim: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    state: {
      type:String,
      required: true,
    },
    city: {
      type:String,
      required: true,
    },
    company_id:String,
    status: {
      type: Boolean,
      required: true,
      default:true,
    },
    otp_verify: {
      type: Boolean,
      default:false,
    },
    image:{
      type:String,
      default:null,
    },
    pin_code: {
      type: Number,
      required: true,
      minlength:6,
      maxlength:6,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum:['customer'],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
    status_date:{
      type: Date,
      default: Date.now(),
    },
    created_date_time:
    {
      type: Date,
      default: Date.now(),
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// customer.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSaltSync(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// customer.methods.isPasswordMatched = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("customer", customer);
