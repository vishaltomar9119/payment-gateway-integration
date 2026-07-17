var express = require('express');
var router = express.Router();

const { createOrder, verifyPayment , getPaymentPage, profile} = require("../controllers/paymentController");




router.get('/payment', getPaymentPage)

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPayment);

router.get('/profile',profile);

router.get('/test' , async(req,res)=>{
    try{
       res.send("testing")
    }catch(err){
        res.send(err)
    }
})




module.exports = router;
