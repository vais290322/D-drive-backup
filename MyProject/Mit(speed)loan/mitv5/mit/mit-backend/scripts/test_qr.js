const http = require('http');

// Configuration
const API_HOST = 'localhost';
const API_PORT = 7061;
const API_BASE = '/api';

// Helper for HTTP Requests
function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: API_BASE + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, headers: res.headers });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    try {
        console.log('--- Starting QR Payment Test (Real Keys) ---');

        // 0. Login
        console.log('0. Logging in...');
        const loginRes = await request('POST', '/auth/login', {
            email: 'admin@mitelectroworld.com',
            password: 'Admin@123'
        });

        if (loginRes.status !== 200) {
            console.error('Login Failed:', loginRes.data);
            return;
        }
        const token = loginRes.data.token;
        const authHeader = { 'Authorization': `Bearer ${token}` };
        console.log('   Login Successful.');

        // 1. Get a Loan ID
        console.log('1. Fetching Loans...');
        const loansRes = await request('GET', '/loans?limit=1', null, authHeader);
        if (loansRes.status !== 200 || !loansRes.data || loansRes.data.length === 0) {
            console.error('Failed to fetch loans:', loansRes.data);
            return;
        }
        const loanId = loansRes.data[0]._id || loansRes.data[0].id;
        console.log(`   Found Loan ID: ${loanId}`);

        // 2. generate QR (Should call Razorpay now)
        console.log('2. Generating QR Code...');
        const qrRes = await request('GET', `/payments/loan/${loanId}/qr`, null, authHeader);
        console.log('   QR Res:', qrRes.data);

        if (qrRes.status !== 200) {
            console.error('Failed to generate QR:', qrRes.data);
            return;
        }

        if (qrRes.data.mock) {
            console.warn('   WARNING: Backend is still in MOCK mode!');
        } else {
            console.log('   SUCCESS: Real QR generated via Razorpay!');
            console.log('   QR ID:', qrRes.data.qr_id);
            console.log('   Image URL:', qrRes.data.image_url);
        }

        // 3. Simulate Webhook
        console.log('3. Simulating Webhook Payment...');
        const amount = 100; // 100 RUPEES
        const paymentId = 'pay_real_' + Date.now();

        // Note: With real keys, Razorpay sends the webhook. 
        // We are just simulating it here to prove the handler works with the signature logic.
        // If we don't send a signature, and secret is not set in env, it should pass?

        const payload = {
            event: 'payment.captured',
            payload: {
                payment: {
                    entity: {
                        id: paymentId,
                        amount: amount * 100, // Paise
                        currency: 'INR',
                        status: 'captured',
                        method: 'upi',
                        notes: {
                            loan_id: loanId,
                            customer_code: 'TEST_REAL'
                        }
                    }
                }
            }
        };

        const webhookRes = await request('POST', '/payments/webhook', payload);
        console.log('   Webhook Response:', webhookRes.status, webhookRes.data);

        // 4. Verify Payment Recorded
        console.log('4. Verifying Payment Record...');
        await new Promise(r => setTimeout(r, 1000));

        const paymentsRes = await request('GET', `/payments/loan/${loanId}`, null, authHeader);
        if (paymentsRes.status === 200) {
            const lastPayment = paymentsRes.data.find(p => p.transaction_reference === paymentId);
            if (lastPayment) {
                console.log('   SUCCESS: Payment found in database:', lastPayment);
            } else {
                console.warn('   Note: Payment not found. Verify if webhook logic allows simulated events without signature.');
            }
        }

        console.log('--- Test Complete ---');

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

run();
