const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Product = require('../models/product')
const Payment = require('../models/payment')
const paymentController = {};


const getPaymentPage = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.render('payment', {
            title: "payment",
            key_id : process.env.RAZORPAY_KEY_ID,
            products:products
        })

    } catch (error) {
        res.send(err)
    }
}

// Create Razorpay Order
const createOrder = async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    const options = {
        amount: amount * 100,
        currency,
        receipt: "receipt_" + Date.now(),
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

// Verify Payment Signature
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount} = req.body;

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        const hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature === razorpay_signature) {

            const payment = new Payment({
                user: req.session.user.id,                 
                razorpay_order_id,
                razorpay_payment_id,
                amount,
                status: "Verified",
                createdAt: new Date()
            });

            await payment.save();

            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Payment Failed!" });
        }
    } catch (err) {
        console.log(err)
    }

};

const profile = async(req , res)=>{  
  try{
    const user = req.session.user;
     res.render('profile', {
            title: "profile",
            user:user
        })
  }catch(err){
    res.send(err)
  }
}


paymentController.createOrder = createOrder;
paymentController.verifyPayment = verifyPayment;
paymentController.getPaymentPage = getPaymentPage;
paymentController.profile = profile;

module.exports = paymentController;
