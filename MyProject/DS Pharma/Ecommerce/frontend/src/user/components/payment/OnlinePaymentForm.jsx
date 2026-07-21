import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';

const OnlinePaymentForm = () => {
    const [paymentType, setPaymentType] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const wallets = [
        { id: 'paytm', name: 'Paytm' },
        { id: 'phonepe', name: 'PhonePe' },
        { id: 'googlepay', name: 'Google Pay' },
        { id: 'amazonpay', name: 'Amazon Pay' },
    ];

    const banks = [
        { id: 'sbi', name: 'State Bank of India' },
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'axis', name: 'Axis Bank' },
        { id: 'kotak', name: 'Kotak Mahindra Bank' },
    ];

    const tabs = [
        { id: 'upi', label: 'UPI' },
        { id: 'wallet', label: 'Wallets' },
        { id: 'netbanking', label: 'Netbanking' },
    ];

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {/* Sub-tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentType(tab.id)}
                        className={`
                            px-4 py-2 rounded-lg text-[12px] font-medium transition-all
                            ${paymentType === tab.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                            }
                        `}
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* UPI Form */}
            {paymentType === 'upi' && (
                <div className="space-y-3">
                    <Input
                        label="UPI ID"
                        name="upiId"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="focus:border-emerald-500 focus:ring-emerald-200"
                    />
                    <p className="text-[8px] sm:text-xs text-gray-500">Enter your UPI ID (e.g., name@okaxis, name@paytm)</p>
                </div>
            )}

            {/* Wallet Selection */}
            {paymentType === 'wallet' && (
                <div className="grid grid-cols-2 gap-3">
                    {wallets.map(wallet => (
                        <button
                            key={wallet.id}
                            type="button"
                            onClick={() => setSelectedWallet(wallet.id)}
                            className={`
                                p-3 rounded-lg text-[12px] font-medium transition-all border-2
                                ${selectedWallet === wallet.id
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                                }
                            `}
                            style={{ fontFamily: 'Gyrotrope' }}
                        >
                            {wallet.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Netbanking Selection */}
            {paymentType === 'netbanking' && (
                <div className="space-y-3">
                    <label className="block mb-2 text-[12px] font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Select Bank
                    </label>
                    <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-[12px]"
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        <option value="">Choose your bank</option>
                        {banks.map(bank => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default OnlinePaymentForm;
