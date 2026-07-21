import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';

const CardPaymentForm = () => {
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
        }
        // Format expiry as MM/YY
        if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
            }
        }
        // Limit CVV to 4 digits
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Input
                label="Cardholder Name"
                name="cardholderName"
                placeholder="Name on card"
                value={formData.cardholderName}
                onChange={handleChange}
                error={errors.cardholderName}
                className="focus:border-emerald-500 focus:ring-emerald-200"
            />
            <Input
                label="Card Number"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                className="focus:border-emerald-500 focus:ring-emerald-200"
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Expiry Date"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    error={errors.expiry}
                    className="focus:border-emerald-500 focus:ring-emerald-200"
                />
                <Input
                    label="CVV"
                    name="cvv"
                    type="password"
                    placeholder="•••"
                    value={formData.cvv}
                    onChange={handleChange}
                    error={errors.cvv}
                    className="focus:border-emerald-500 focus:ring-emerald-200"
                />
            </div>
        </div>
    );
};

export default CardPaymentForm;
