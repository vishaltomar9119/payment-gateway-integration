var express = require('express');
var router = express.Router();

const { createOrder, verifyPayment , getPaymentPage} = require("../controllers/paymentController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

router.get('/payment', getPaymentPage)


module.exports = router;
