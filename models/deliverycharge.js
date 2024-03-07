const mongoose = require('mongoose');

var deliverycharge = new mongoose.Schema({
  delivery_charge: {
    type: Number
  },
  status: {
    type: Boolean
  },
  created_date_time: {
    type: Date,
    default: Date.now(),
  },
},{
  timestamps: true,
  versionKey: false
}

)

module.exports = mongoose.model('deliverycharge', deliverycharge)