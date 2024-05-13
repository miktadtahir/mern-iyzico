
const express = require('express'); // don't forget to install express package
const router = express.Router(); // don't forget to install express package

const iyzicoRoutes = require('./iyzicoRoutes'); // don't forget to create iyzicoRoutes.js file

router.use('/iyzico', iyzicoRoutes); // don't forget to create iyzicoRoutes.js

//final url is /iyzico/initialize-payment

module.exports = router;
