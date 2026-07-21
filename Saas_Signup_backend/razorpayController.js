const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('./User'); // Your user model
const Subscription = require('./Subscription'); // Create this model for tracking subscriptions

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount = 99 } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay expects amount in smallest currency unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto-capture payment
    };
    
    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify payment and create user
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userData
    } = req.body;
    
    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const newUser = new User({
      userName: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      schoolName: userData.schoolName,
      address: userData.address,
      instituteType: userData.instituteType,
      password: hashedPassword,
      role: 'admin', // Default role for new signup
      isActive: true
    });
    
    const savedUser = await newUser.save();
    
    // Create subscription record
    const subscription = new Subscription({
      userId: savedUser._id,
      schoolId: savedUser._id, // Assuming school ID is the same as user ID for new signups
      status: 'active',
      plan: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: 99,
        currency: 'INR'
      }
    });
    
    await subscription.save();
    
    // Get payment details from Razorpay for record
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    
    return res.status(201).json({
      success: true,
      message: 'User created successfully with active subscription',
      user: {
        id: savedUser._id,
        userName: savedUser.userName,
        email: savedUser.email
      },
      subscription: {
        status: 'active',
        expiresAt: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment and create user',
      error: error.message
    });
  }
};

// Get subscription status
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscription = await Subscription.findOne({ 
      userId, 
      status: 'active',
      endDate: { $gt: new Date() } 
    }).sort({ endDate: -1 });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    return res.status(200).json({
      success: true,
      subscription: {
        status: subscription.status,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        daysRemaining: Math.ceil((subscription.endDate - new Date()) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription status',
      error: error.message
    });
  }
};