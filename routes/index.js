var express = require('express');
var router = express.Router();

const { createOrder, verifyPayment , getPaymentPage, profile} = require("../controllers/paymentController");




router.get('/payment', getPaymentPage)

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPayment);

router.get('/profile',profile);




module.exports = router;
