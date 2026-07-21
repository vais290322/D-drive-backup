// @ts-ignore
import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID || '',
        process.env.PAYPAL_CLIENT_SECRET || ''
    )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID || '',
        process.env.PAYPAL_CLIENT_SECRET || ''
    );

const client = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (amount: number) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount.toString(),
            },
        }],
    });

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        console.error('PayPal Create Order Error:', error);
        throw error;
    }
};

export const capturePayment = async (orderId: string) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        console.error('PayPal Capture Payment Error:', error);
        throw error;
    }
};
