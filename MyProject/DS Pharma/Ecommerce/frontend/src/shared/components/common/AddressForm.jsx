import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { MapPin, Home, Briefcase, Save, Loader2, User, Phone, X, Mail } from 'lucide-react';

const AddressForm = ({ initialData, onSave, onCancel, isSaving, title }) => {
    const [formData, setFormData] = useState(initialData || {
        type: 'Home',
        name: '',
        phone: '',
        altPhone: '',
        email: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        
        if (!formData.phone) {
            newErrors.phone = 'Phone is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone must be 10 digits';
        }

        if (formData.altPhone && formData.altPhone.length !== 10) {
            newErrors.altPhone = 'Alt Phone must be 10 digits';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (formData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSave(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const inputClasses = "w-full text-xs pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300";
    const labelClasses = "block mb-2 text-xs sm:text-sm font-medium text-gray-700";

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    {title || (initialData ? 'Edit Address' : '')}
                </h3>
                {onCancel && (
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelClasses}>Address Type</label>
                    <div className="flex gap-4">
                        {['Home', 'Work', 'Other'].map(type => (
                            <button
                                style={{padding: '0px 5px'}}
                                key={type}
                                type="button"
                                onClick={() => handleChange('type', type)}
                                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border transition-all ${
                                    formData.type === type 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-emerald-300'
                                }`}
                            >
                                {type === 'Home' && <Home className="w-4 h-4" />}
                                {type === 'Work' && <Briefcase className="w-4 h-4" />}
                                {type === 'Other' && <MapPin className="w-4 h-4" />}
                                <span className="text-sm font-medium" style={{marginTop: '5px',}}>{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>Recipient Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <User size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`${inputClasses} ${errors.name ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="Receiver's Name"
                        />
                         
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</p>}
                </div>

                <div className="relative">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Phone size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleChange('phone', val);
                            }}
                            className={`${inputClasses} ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="10-digit mobile number"
                        />
                         
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone}</p>}
                </div>

                <div className="relative">
                    <label className={labelClasses}>Alternative Phone (Optional)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Phone size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="tel"
                            value={formData.altPhone || ''}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleChange('altPhone', val);
                            }}
                            className={`${inputClasses} ${errors.altPhone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="Alt mobile number"
                        />
                         
                    </div>
                    {errors.altPhone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.altPhone}</p>}
                </div>

                <div className="md:col-span-2 relative">
                    <label className={labelClasses}>Email Address (Optional)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                             <Mail size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`${inputClasses} ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="example@gmail.com"
                        />
                         
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2 relative">
                    <label className={labelClasses}>Address (House No, Building, Street)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-3 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <textarea
                            style={{padding: '12px 30px'}}
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className={`${inputClasses} min-h-[80px] pt-3 ${errors.address ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="Full address"
                        />
                        
                    </div>
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.address}</p>}
                </div>

                <div className="md:col-span-2 relative">
                    <label className={labelClasses}>Landmark (Optional)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.landmark || ''}
                            onChange={(e) => handleChange('landmark', e.target.value)}
                            className={inputClasses}
                            placeholder="Near Apollo Pharmacy"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>City</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={`${inputClasses} ${errors.city ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="City"
                        />
                        
                    </div>
                    {errors.city && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.city}</p>}
                </div>

                <div className="relative">
                    <label className={labelClasses}>State</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={`${inputClasses} ${errors.state ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="State"
                        />
                        
                    </div>
                    {errors.state && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.state}</p>}
                </div>

                <div className="relative">
                    <label className={labelClasses}>Pincode</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            className={`${inputClasses} ${errors.pincode ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="6-digit pincode"
                        />
                        
                    </div>
                    {errors.pincode && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.pincode}</p>}
                </div>
                
                <div className="flex items-center gap-2 top-5" style={{marginTop: '20px'}}>
                    <input 
                        type="checkbox" 
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => handleChange('isDefault', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-600 cursor-pointer" style={{marginTop: '4px'}}>Set as default address</label>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8" style={{marginTop: '10px'}}>
                {onCancel && (
                    <button
                        style={{padding: '5px 10px'}}
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    style={{padding: '5px 10px'}}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-200"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>Save Address</span>
                </button>
            </div>
        </Motion.div>
    );
};

export default AddressForm;
