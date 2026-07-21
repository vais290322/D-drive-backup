import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Edit2, Save, X, User, Mail, Phone, Loader2 } from 'lucide-react';
import useIsMobile from '@/shared/hooks/useIsMobile';
import { userProfileService } from '@/services/userProfileService';
import { toast } from 'react-toastify';


const PersonalInfoForm = () => {
    const isMobile = useIsMobile(768);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [tempData, setTempData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    // Fetch user profile data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await userProfileService.getUserProfile();
            const userData = response.data || response;
            const profileInfo = {
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || ''
            };
            setProfileData(profileInfo);
            setTempData(profileInfo);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load user profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setTempData({ ...profileData });
        setErrors({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempData({ ...profileData });
        setErrors({});
    };

    const handleInputChange = (field, value) => {
        setTempData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!tempData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!tempData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!tempData.phone) {
            newErrors.phone = 'Phone is required';
        } else if (tempData.phone.length !== 10) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            setIsSaving(true);
            const response = await userProfileService.updateUserProfile(tempData);
            setProfileData({ ...tempData });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `w-full ${isMobile ? 'text-[10px]' : 'text-xs'} pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300`;
    const labelClasses = `block mb-1 ${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} font-medium text-gray-700`;

    if (isLoading) {
        return (
            <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                style={{ marginTop: isMobile ? '0' : '30px', padding: isMobile ? '5px' : '10px', marginBottom: isMobile ? '5px' : '10px'}}
            >
                <div className="flex justify-center items-center p-12">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
            </Motion.div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ marginTop: isMobile ? '0' : '30px', padding: isMobile ? '5px' : '10px', marginBottom: isMobile ? '5px' : '10px'}}
        >

            <div className={`border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white ${isMobile ? 'p-4' : 'p-6'}`} style={{ marginBottom: isMobile ? '8px' : '15px' }}>
                <div>
                    <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>Personal Information</h2>
                    <p className={`${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} text-gray-500 mt-0.5`}>Manage your personal details</p>
                </div>

                
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className={`flex items-center gap-1 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors`}
                        style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                    >

                        <Edit2 className="w-4 h-4" />
                        <span className='hidden sm:inline-block' style={{ marginTop: '3px'}}>Edit Details</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-1">
                         <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                        >
                            <X className="w-4 h-4" />
                            <span className='hidden sm:inline-block' style={{ marginTop: '3px'}}>Cancel</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-1 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
                            style={{ padding: isMobile ? '2px 10px' : '2px 10px'}}
                        >
                            {isSaving ? (
                                <Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} animate-spin`} />
                            ) : (
                                <Save className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                            )}
                            <span className='hidden sm:inline-block' style={{ marginTop: isMobile ? '1px' : '3px'}}>Save Changes</span>
                        </button>
                    </div>
                )}
            </div>


            {/* Personal Info Grid */}
            <div className={`${isMobile ? 'p-4' : 'p-6'} grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6`}>

                {/* Name */}
                <div className="relative md:col-span-2">
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <User size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="text"
                            value={isEditing ? tempData.name : profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                            className={`${inputClasses} ${errors.name ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="Enter your full name"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                {!isEditing && <div className="relative">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Mail size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="email"
                            value={isEditing ? tempData.email : profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className={`${inputClasses} ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="name@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
                </div>}

                {/* Phone Number */}
                <div className="relative">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Phone size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="tel"
                            value={isEditing ? tempData.phone : profileData.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                handleInputChange('phone', val);
                            }}
                            disabled={!isEditing}
                            className={`${inputClasses} ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                            placeholder="10-digit phone number"
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone}</p>}
                </div>
            </div>
        </Motion.div>
    );
};

export default PersonalInfoForm;
