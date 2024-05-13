const Iyzipay = require('iyzipay'); // don't forget to install iyzipay package

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY, // don't forget to set these environment variables
    secretKey: process.env.IYZICO_SECRET_KEY, // don't forget to set these environment variables
    uri: process.env.IYZICO_BASE_URL // sandbox or production
});

module.exports = iyzipay;
