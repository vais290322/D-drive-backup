import React, { useState } from 'react';
import PaymentOptionCard from './PaymentOptionCard';
import CardPaymentForm from './CardPaymentForm';
import OnlinePaymentForm from './OnlinePaymentForm';
import Button from '@/shared/components/ui/Button';

const paymentMethods = [
    {
        id: 'online',
        name: 'Online Payment',
        description: 'UPI, Wallets, Netbanking',
    },
    {
        id: 'card',
        name: 'Debit / Credit Card',
        description: 'Visa, Mastercard, RuPay',
    },
    {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive',
    },
];

const PaymentMethodSelector = ({ onProceed, isLoading = false }) => {
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleProceed = () => {
        if (onProceed && selectedMethod) {
            onProceed(selectedMethod);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 
                className="text-2xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'Gyrotrope' }}
            >
                Select Payment Method
            </h2>

            <div className="space-y-3" role="radiogroup" aria-label="Payment methods">
                {paymentMethods.map(method => (
                    <div key={method.id}>
                        <PaymentOptionCard
                            method={method}
                            selected={selectedMethod === method.id}
                            onSelect={setSelectedMethod}
                        />
                        
                        {/* Expandable forms */}
                        {selectedMethod === method.id && method.id === 'card' && (
                            <CardPaymentForm />
                        )}
                        {selectedMethod === method.id && method.id === 'online' && (
                            <OnlinePaymentForm />
                        )}
                    </div>
                ))}
            </div>

            {/* COD Info */}
            {selectedMethod === 'cod' && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-sm text-amber-800" style={{ fontFamily: 'Gyrotrope' }}>
                        💵 Pay in cash when your order is delivered. Please keep exact change ready.
                    </p>
                </div>
            )}

            {/* Proceed Button */}
            <div className="mt-8">
                <Button
                    variant="primary"
                    size="full"
                    onClick={handleProceed}
                    disabled={!selectedMethod || isLoading}
                    className="bg-emerald-600! hover:bg-emerald-700! shadow-emerald-200! py-3.5! text-lg! rounded-xl!"
                >
                    {isLoading ? 'Processing...' : 'Proceed to Pay'}
                </Button>
            </div>

            {/* Security Note */}
            <p className="text-center text-[8px] sm:text-xs text-gray-500 mt-4" style={{ fontFamily: 'Gyrotrope' }}>
                🔒 Your payment information is secure and encrypted
            </p>
        </div>
    );
};

export default PaymentMethodSelector;
