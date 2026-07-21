import React from 'react';
import { CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';

const PaymentOptionCard = ({ method, selected, onSelect }) => {
    const icons = {
        'online': Smartphone,
        'cod': Banknote,
        'card': CreditCard,
        'wallet': Wallet,
    };

    const Icon = icons[method.id] || CreditCard;

    return (
        <button
            type="button"
            onClick={() => onSelect(method.id)}
            role="radio"
            aria-checked={selected}
            className={`
                w-full p-4 sm:p-5
                rounded-2xl border-2
                flex items-center gap-4
                transition-all duration-200
                cursor-pointer
                text-left
                ${selected 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                }
            `}
            style={{ fontFamily: 'Gyrotrope' }}
        >
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${selected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}
                transition-colors duration-200
            `}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className={`font-semibold text-base ${selected ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {method.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
            </div>
            <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
            `}>
                {selected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                )}
            </div>
        </button>
    );
};

export default PaymentOptionCard;
