const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const paymentController = {};


const getPaymentPage = async (req, res) => {
    try {
        res.render('payment', {
            title: "payment",
            key_id : process.env.RAZORPAY_KEY_ID
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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        const hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature === razorpay_signature) {
            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Payment Failed!" });
        }
    } catch (err) {
        console.log(err)
    }

};


paymentController.createOrder = createOrder;
paymentController.verifyPayment = verifyPayment;
paymentController.getPaymentPage = getPaymentPage;

module.exports = paymentController;
