const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const request = require("request");

const generateHash = (data) => {
  try {
    let obj = {
      key: data.key,
      txnid: data.txnid,
      amount: data.amount,
      productinfo: data.productinfo,
      firstname: data.firstname,
      email: data.email,
      udf1: data.udf1,
      udf2: data.udf2,
      udf3: data.udf3,
      udf4: data.udf4,
      udf5: data.udf5,
      udf6: data.udf6,
      udf7: data.udf7,
      udf8: data.udf8,
      udf9: data.udf9,
      udf10: data.udf10,
      salt: this.salt,
    };
    let arr = Object.values(obj);
    let hashSrc = arr.join("|");
    const sha512 = crypto.createHash("sha512");
    return sha512.update(hashSrc, "utf-8").digest("hex");
  } catch (error) {
    throw error;
  }
};

const geturl = (env) => {
  let url_link;
  if (env == "test") {
    url_link = "https://testpay.easebuzz.in";
  } else if (env == "production") {
    url_link = "https://pay.easebuzz.in";
  } else {
    url_link = "https://testpay.easebuzz.in";
  }
  return url_link;
};

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const curl_call = (url, data, method = 'POST') => {
  let options = {
    'method': method,
    'url': url,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: data,
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (response) {
        var data = JSON.parse(response.body)
        return resolve(data);
      } else
        return reject(error);
    })
  })
}

const form = (data) => {
  return {
    'key': data.key,
    'txnid': data.txnid,
    'amount': data.amount,
    'email': data.email,
    'phone': data.phone,
    'firstname': data.firstname,
    'udf1': data.udf1,
    'udf2': data.udf2,
    'udf3': data.udf3,
    'udf4': data.udf4,
    'udf5': data.udf5,
    'hash': data.hash,
    "tax": data.tax,
    'productinfo': data.productinfo,
    'udf6': data.udf6,
    'udf7': data.udf7,
    'udf8': data.udf8,
    'udf9': data.udf9,
    'udf10': data.udf10,
    'furl': data.furl, //'http://localhost:3000/response',
    'surl': data.surl, //'http://localhost:3000/response'
  };
}

const initiatePayment = async (data) => {
  try {
    this.key = process.env.pkey;
    this.salt = process.env.psalt;
    let obj = {
      key: this.key,
      txnid: String(data._id),
      amount: data.amount,
      tax: data.tax,
      productinfo: "Products",
      firstname: data.name,
      email: data.email_id,
      udf1: "",
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
      udf6: "",
      udf7: "",
      udf8: "",
      udf9: "",
      udf10: "",
      phone: data.mobile_number,
      surl: `${process.env.server}`, //`${process.env.server}api/v1/mobile/paymentinfo/success`
      furl: `${process.env.server}`, //`${process.env.server}api/payment/paymentinfo/failure`
      message: "",
    };
    obj.hash = generateHash(obj);
    let url = geturl(process.env.configuration) + "/payment/initiateLink";
    let response = await curl_call(url, form(obj));
    if (response.status == 1) {
      return {
        success: true,
        key: this.key,
        access_key: response.data,
        redirect: geturl(process.env.configuration) + `/pay/${response.data}`,
      };
    }
    throw new Error(response.error_desc);
  } catch (error) {
    throw error;
  }
};

module.exports = { initiatePayment };
