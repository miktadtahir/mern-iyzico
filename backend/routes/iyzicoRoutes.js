const express = require('express'); // don't forget to install express package
const router = express.Router(); // don't forget to install express package
const paymentController = require('../controllers/iyzicoController'); // don't forget to create iyzicoController.js file

router.post('/initialize-payment', paymentController.initializePayment); // don't forget to create initializePayment function in iyzicoController.js

module.exports = router;
