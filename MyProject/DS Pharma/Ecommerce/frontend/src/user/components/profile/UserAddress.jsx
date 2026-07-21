import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Edit2, 
    Plus, 
    Trash2, 
    CheckCircle, 
    X, 
    Home, 
    Briefcase,
    Loader2,
    User,
    Phone,
    Save,
    Mail
} from 'lucide-react';
// import { userApi } from '@/config/userApi';
import { userAddressService } from '@/services/userAddressService';
import useIsMobile from '@/shared/hooks/useIsMobile';
import { toast } from 'react-toastify';

// ============================================================
// Address Form Component (Inline)
// ============================================================
const AddressForm = ({ initialData, onSave, onCancel, isSaving, title }) => {
    const [formData, setFormData] = useState({
        type: initialData?.type || 'Home',
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        altPhone: initialData?.altPhone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        street: initialData?.street || '',
        district: initialData?.district || '',
        landmark: initialData?.landmark || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pincode: initialData?.pincode || initialData?.postalCode || '',
        isDefault: initialData?.isDefault || false
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
                    {title || (initialData ? 'Edit Address' : 'Add New Address')}
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
                    <label className={labelClasses}>Street (Optional)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.street || ''}
                            onChange={(e) => handleChange('street', e.target.value)}
                            className={inputClasses}
                            placeholder="Street name"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>District (Optional)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[47%] -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={16} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.district || ''}
                            onChange={(e) => handleChange('district', e.target.value)}
                            className={inputClasses}
                            placeholder="District"
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
                
                {/* Only show 'Set as Default' checkbox when adding new address, not when editing */}
                {/* {!initialData && (
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
                )} */}
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

// ============================================================
// Main UserAddress Component
// ============================================================
const UserAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isMobile = useIsMobile(768);

    // Fetch addresses on component mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await userAddressService.getAllAddresses();
            setAddresses(response.data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setAddresses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            setIsSaving(true);
            if (editingId) {
                // Update existing address
                await userAddressService.updateAddress(editingId, data);
                setEditingId(null);
            } else {
                // Add new address
                await userAddressService.addAddress(data);
                setIsAdding(false);
            }
            // Refresh addresses list
            await fetchAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error(error.response?.data?.message || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            setIsSaving(true);
            // Call dedicated setaddress endpoint - no need to pass address data
            await userAddressService.setDefaultAddress(id);
            await fetchAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error(error.response?.data?.message || 'Failed to set default address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                setIsDeleting(true);
                await userAddressService.deleteAddress(id);
                await fetchAddresses();
            } catch (error) {
                console.error('Error deleting address:', error);
                toast.error(error.response?.data?.message || 'Failed to delete address');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ marginTop: isMobile ? '0' : '30px', padding: isMobile ? '5px' : '10px', marginBottom: '10px' }}
        >
            <div className={`border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-emerald-50/50 to-white ${isMobile ? 'p-4' : 'p-6'}`} style={{ marginBottom: isMobile ? '8px' : '15px' }}>
                <div>
                    <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>Saved Addresses</h2>
                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} text-gray-500 mt-0.5`}>Manage delivery locations</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        style={{ padding: isMobile ? '6px 14px' : '8px 16px' }}
                        onClick={() => setIsAdding(true)}
                        className={`flex items-center gap-1 ${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm`}
                    >
                        <Plus className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                        <span className='hidden sm:inline-block' style={{ marginTop: isMobile ? '1px' : '3px' }}>Add New Address</span>
                    </button>
                )}
            </div>

            <div className="p-6">
                <AnimatePresence>
                    {(isAdding || editingId) && (
                        <AddressForm 
                            initialData={editingId ? addresses.find(a => (a._id || a.id) === editingId) : null}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsAdding(false);
                                setEditingId(null);
                            }}
                            isSaving={isSaving}
                        />
                    )}
                </AnimatePresence>

                {addresses.length === 0 && !isAdding ? (
                    <div className="text-center flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200" style={{ padding: '10px' }}>
                        <div className='text-center'> <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" /></div>
                        <h3 className="text-gray-900 font-medium mb-1">No addresses found</h3>
                        <p className="text-gray-500 text-sm mb-4">Add an address to speed up checkout</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
                        >
                            Add your first address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ padding: '5px' }}>
                        {addresses.map((addr) => (
                            <Motion.div
                                style={{ padding: isMobile ? '5px' : '10px' }}
                                key={addr._id || addr.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`group relative ${isMobile ? 'p-4' : 'p-5'} rounded-xl border-2 transition-all hover:shadow-md ${
                                    addr.isDefault 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-gray-100 bg-white hover:border-emerald-200'
                                }`}
                            >
                                {addr.isDefault && (
                                    <div className="absolute top-4 right-2 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                                        style={{ padding:'2px 5px' }}
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        <span style={{ marginTop: '3px' }}>Default</span>
                                    </div>
                                )}

                                {!addr.isDefault && (
                                    <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => handleSetDefault(addr._id || addr.id)}
                                        className="absolute top-4 right-2 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-400"
                                    >
                                        <span style={{ marginTop: '3px' }}>Set as Default</span>
                                    </button>
                                )}
                                
                                <div className="flex items-start gap-2 mb-3">
                                    <div className={`rounded-lg ${isMobile ? 'p-2' : 'p-2.5'} ${
                                        addr.type === 'Home' ? 'bg-blue-100 text-blue-600' : 
                                        addr.type === 'Work' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                        {addr.type === 'Home' && <Home className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                        {addr.type === 'Work' && <Briefcase className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                        {['Home', 'Work'].indexOf(addr.type) === -1 && <MapPin className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />}
                                    </div>
                                    <div>
                                        <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-900`}>{addr.type}</h4>
                                        <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium text-gray-600`}>{addr.name}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1 mb-4" style={{ paddingLeft: isMobile ? '32px' : '33px' }}>
                                    <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 leading-relaxed`}>
                                        {addr.address}<br />
                                        {addr.street && <span className={`block text-gray-500 ${isMobile ? 'text-[10px]' : 'text-[10px]'} mt-0.5`}>Street: {addr.street}</span>}
                                        {addr.landmark && <span className={`block text-emerald-600 font-medium ${isMobile ? 'text-[10px]' : 'text-[10px]'} mt-0.5 mb-0.5`}>Landmark: {addr.landmark}</span>}
                                        {addr.district && <span className={`block text-gray-500 ${isMobile ? 'text-[10px]' : 'text-[10px]'} mt-0.5`}>District: {addr.district}</span>}
                                        {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.postalCode || addr.pincode}</span>
                                    </p>
                                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-2 space-y-0.5`}>
                                        <p className="text-[10px] ms:text-xs font-medium text-gray-700">Mobile: <span className="text-[10px] font-medium text-gray-700">{addr.phone}</span></p>
                                        {addr.altPhone && <p className="text-[10px] sm:text-xs font-medium text-gray-700">Alt Phone: <span className="text-[10px] font-medium text-gray-700">{addr.altPhone}</span></p>}
                                    </div>
                                </div>
                                
                                <div className={`flex items-end justify-end gap-2 pt-3 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity ${isMobile ? 'pl-8' : 'pl-10'}`}>
                                    <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => setEditingId(addr._id || addr.id)}
                                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Edit</span>
                                    </button>
                                    <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => handleDelete(addr._id || addr.id)}
                                        disabled={isDeleting}
                                        className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Delete</span>
                                    </button>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Motion.div>
    );
};

export default UserAddress;