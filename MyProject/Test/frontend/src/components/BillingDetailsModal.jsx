import React, { useState } from "react";
import { XMarkIcon, IdentificationIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

const BillingDetailsModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        billingName: "",
        billingAddress: "",
        gstNumber: "",
        phone: "",
        email: ""
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative scale-in-center">
                <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">Billing Details</h2>
                        <p className="text-indigo-100 text-sm font-medium">Please provide your billing info for invoices</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-4">
                        <div className="relative">
                            <IdentificationIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="Billing Name / Company Name"
                                value={formData.billingName}
                                onChange={(e) => setFormData({ ...formData, billingName: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="relative">
                            <MapPinIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <textarea
                                required
                                placeholder="Billing Address"
                                value={formData.billingAddress}
                                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium h-24 resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="tel"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="email"
                                    placeholder="Billing Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <BuildingOffice2Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="GST Number (Optional)"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BillingDetailsModal;
