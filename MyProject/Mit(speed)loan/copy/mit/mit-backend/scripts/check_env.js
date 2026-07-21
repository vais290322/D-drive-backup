require('dotenv').config();

console.log('CWD:', process.cwd());
console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
console.log('KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');

if (process.env.RAZORPAY_KEY_ID) {
    console.log('First 4 chars:', process.env.RAZORPAY_KEY_ID.substring(0, 4));
}
