const axios = require("axios");
var url = "http://sms.smsera.net/WebServiceSMS.aspx";
var user_name = "CAUVRY";
var password = "CaUv6Y2017";
var sid = "DAKSAK";
var mtype = "N";
var DR = "Y";
// var place_order = "Hi *, Thank you for shopping at Daksakthe Your order no. * has been received and it is being processed for shipping. Team Daksakthe.";
const otpsms = async (mobile_number, message) => {
  const data = {
    User: user_name,
    passwd: password,
    sid: sid,
    mtype: mtype,
    DR: DR,
    mobilenumber: mobile_number,
    message: `${message} is your OTP for Login, Thanks, Daksakthe`,
  };

  const response = await axios.get(url, { params: data });
  return response.data;
};
const placeordersms = async (mobile_number, name, orderno) => {
  const data = {
    User: user_name,
    passwd: password,
    sid: sid,
    mtype: mtype,
    DR: DR,
    mobilenumber: mobile_number,
    message: `Hi ${name}, Thank you for shopping at Daksakthe Your order no. ${orderno} has been received and it is being processed for shipping. Team Daksakthe.`,
  };
  const response = await axios.get(url, { params: data });
  return response.data;
};



module.exports = {
  otpsms,
  placeordersms
}