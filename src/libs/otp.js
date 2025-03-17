const otpGenerator = require('otp-generator')
const cryptojs = require('crypto-js')
// otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

async function generateOTP(params, callback) {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const ttl = 5 * 60 * 1000; //5 minutes  in miliseconds  
    const expires = Date.now() + ttl;   
    const data = `${params.phone}:${otp}:${expires}`;
    const hash = cryptojs.AES.encrypt(data, process.env.OTP_SECRET).toString(); 
    const fullhash = `${hash}.${expires}`;
    console.log(`your otp is ${otp}`);
    callback(null, fullhash);
}

async function verifyOTP(params, callback) {
    const [hash, expires] = params.hash.split('.');
    const data = cryptojs.AES.decrypt(hash, process.env.OTP_SECRET).toString(cryptojs.enc.Utf8);
    const [phone, otp, _expires] = data.split(':');
    if (Date.now() > parseInt(expires)) {
        return callback('OTP expired');
    }
    if (params.otp === parseInt(otp) && params.phone === parseInt(phone)) {
        return callback(null, 'OTP verified');
    }
    callback('Invalid OTP');
}
module.exports = { generateOTP, verifyOTP };