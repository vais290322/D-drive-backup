import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Settings,
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// Hooks & Store
import { useProfile, useUpdateProfile } from '@/shared/hooks/queries/useProfile';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/shared/hooks/queries/useAddresses';
import { useAuthStore } from '@/store/useAuthStore';

// Components
import PersonalInfoForm from '@/user/components/profile/PersonalInfoForm';
import AddressesList from '@/user/components/profile/AddressesList';
import OrdersPreview from '@/user/components/profile/OrdersPreview';
import AccountActions from '@/user/components/profile/AccountActions';
import OrdersList from '@/user/components/profile/OrdersList';
import ProfileSidebar from '@/user/components/profile/ProfileSidebar';
import WishlistSection from '@/user/components/profile/WishlistSection';
import { Heart } from 'lucide-react';
import useIsMobile from '@/shared/hooks/useIsMobile';
import UserAddress from '../components/profile/UserAddress';


const UserProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user: currentUser } = useAuthStore();
    const [activeSection, setActiveSection] = useState('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const isMobile = useIsMobile(768);


    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Debounce redirect to allow logout action (which navigates to /) to complete
            const timer = setTimeout(() => {
                navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`, { replace: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate]);

    // Fetch profile data
    const { data: profileDataResponse, isLoading } = useProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    // Fetch addresses at parent level to prevent reload on section switch
    const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses();
    const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
    const { mutate: updateAddress, isPending: isUpdatingAddress } = useUpdateAddress();
    const { mutate: deleteAddress, isPending: isDeletingAddress } = useDeleteAddress();

    // Dynamic profile data with fallback
    const [profileData, setProfileData] = useState(null);
    const [tempProfileData, setTempProfileData] = useState({});

    // Sync profile data
    useEffect(() => {
        const data = profileDataResponse || currentUser;
        if (data) {
            setProfileData(data);
            setTempProfileData(data);
        }
    }, [currentUser, profileDataResponse]);

    // Profile handlers
    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setTempProfileData({ ...profileData });
    };

    const handleSaveProfile = () => {
        updateProfile(tempProfileData, {
            onSuccess: () => {
                setProfileData(tempProfileData);
                setIsEditingProfile(false);
            }
        });
    };

    const handleCancelProfile = () => {
        setTempProfileData({ ...profileData });
        setIsEditingProfile(false);
    };

    const handleProfileChange = (field, value) => {
        setTempProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const sections = [
        { id: 'overview', label: 'Overview', icon: User, desc: 'Personal details' },
        // { id: 'orders', label: 'Orders', icon: ShoppingBag, desc: 'Track & Buy again' },
        // { id: 'wishlist', label: 'Wishlist', icon: Heart, desc: 'Saved for later' },
        { id: 'addresses', label: 'Addresses', icon: MapPin, desc: 'Manage locations' },
        // { id: 'account', label: 'Settings', icon: Settings, desc: 'Account actions' }
    ];

    if (isLoading || isLoadingAddresses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page-wrapper min-h-screen w-full bg-gray-50 font-sans flex flex-col">
            <style>{`
                .profile-page-wrapper {
                    padding-top: 60px;
                }
                @media (min-width: 768px) {
                    .profile-page-wrapper {
                        padding-top: 80px !important;
                    }
                }
                @media (max-width: 639px) {
                    .profile-container {
                        padding-left: 5px !important;
                        padding-right: 5px !important;
                    }
                }
            `}</style>
            {/* Main Content Area - flex-1 ensures it takes available space */}
            <main className="profile-container flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '16px 8px' : undefined }}>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

                    <ProfileSidebar 
                        profileData={profileData} 
                        activeSection={activeSection} 
                        setActiveSection={setActiveSection} 
                        sections={sections} 
                    />

                    {/* Right Content Area with Min-Height for Stability */}
                    <div className="lg:col-span-9">
                        {/* Min-height container prevents layout shifts - Responsive */}
                        <div style={{ 
                            minHeight: isMobile 
                                ? 'calc(100vh - 220px)'   // Mobile - reduced for smaller screens
                                : 'calc(100vh - 320px)'  // Desktop/Tablet
                        }}>

                            <AnimatePresence mode="wait">
                                <Motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeSection === 'overview' && (
                                        <div className="space-y-4 sm:space-y-6">
                                            <PersonalInfoForm />
                                            <div className="">
                                                {/* <OrdersPreview /> */}
                                                
                                            </div>
                                        </div>
                                    )}

                                    {/* {activeSection === 'orders' && (
                                        <div className="space-y-4 sm:space-y-6">
                                           <OrdersList />
                                        </div>
                                    )} */}
                                    
                                    {/* {activeSection === 'wishlist' && <WishlistSection />} */}
                                    
                                    {activeSection === 'addresses' && (
                                        <UserAddress 
                                            addressesData={addressesData}
                                            addAddress={addAddress}
                                            updateAddress={updateAddress}
                                            deleteAddress={deleteAddress}
                                            isAddingAddress={isAddingAddress}
                                            isUpdatingAddress={isUpdatingAddress}
                                            isDeletingAddress={isDeletingAddress}
                                        />
                                    )}
                                    {activeSection === 'account' && <AccountActions />}
                                </Motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default UserProfile;