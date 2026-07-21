import React, { useRef, useState } from 'react';
import { User, Camera, ChevronRight, LogOut, Loader2, Trash2, Check, X } from 'lucide-react';
import { useLogout } from '@/shared/hooks/useLogout';
import { useUploadProfileImage, useRemoveProfileImage } from '@/shared/hooks/mutations/useProfileImage';
import { useAuthStore } from '@/store/useAuthStore';
import { validateImage, createImagePreview } from '@/utils/imageValidation';
import useIsMobile from '@/shared/hooks/useIsMobile';


const ProfileSidebar = ({ 
    profileData, 
    activeSection, 
    setActiveSection, 
    sections 
}) => {
    const logout = useLogout();
    const { user: currentUser } = useAuthStore();
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const isMobile = useIsMobile(768);


    const { mutate: uploadImage, isPending: isUploading } = useUploadProfileImage();
    const { mutate: removeImage, isPending: isRemoving } = useRemoveProfileImage();

    const handleLogout = () => {
        logout();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;

        try {
            validateImage(file);
            const previewUrl = await createImagePreview(file);
            setPreview(previewUrl);
            setSelectedFile(file);
        } catch (err) {
            console.error(err);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleConfirmUpload = () => {
        if (!selectedFile || !currentUser) return;
        uploadImage(
            { userId: currentUser.id, file: selectedFile },
            {
                onSuccess: () => {
                    setPreview(null);
                    setSelectedFile(null);
                }
            }
        );
    };

    const handleCancelPreview = () => {
        setPreview(null);
        setSelectedFile(null);
    };

    const handleRemoveImage = () => {
        if (!currentUser) return;
        if (window.confirm('Are you sure you want to remove your profile picture?')) {
            removeImage(currentUser.id);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const isProcessing = isUploading || isRemoving;
    const avatarUrl = profileData?.avatar || profileData?.profileImage || profileData?.image;

    return (
        <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start space-y-6 md:min-h-[calc(100vh-200px)]" style={{ marginTop: isMobile ? '0px' : '30px' }}>
            {/* User Mini Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center" style={{ marginBottom: isMobile ? '5px' : '10px', padding: isMobile ? '12px' : '24px'}}>
                <div className="relative mb-4 group">
                    <div 
                        className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full bg-gray-50 flex items-center justify-center border-4 border-white shadow-md overflow-hidden transition-all duration-300 ${!isProcessing ? 'cursor-pointer hover:shadow-lg' : ''}`}
                        onClick={!isProcessing ? triggerFileInput : undefined}
                    >

                        {preview || avatarUrl ? (
                            <img src={preview || avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                <User className="w-10 h-10 text-emerald-600" />
                            </div>
                        )}

                 
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-full flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                
                    {!isProcessing && (
                        <>
                            {preview ? (
                                <div className="absolute -bottom-3 flex gap-2 left-1/2 -translate-x-1/2 z-20" >
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleConfirmUpload(); }}
                                        className="p-1.5 bg-emerald-600 text-white text-center w-8 rounded-full shadow-lg border-2 border-white hover:bg-emerald-700 transition-all hover:scale-110"
                                        title="Confirm Upload"
                                    >
                                        <Check className="w-3.5 h-3.5" style={{ margin: 'auto' }} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleCancelPreview(); }}
                                        className="p-1.5 bg-red-600 text-white text-center w-8 rounded-full shadow-lg border-2 border-white hover:bg-red-700 transition-all hover:scale-110"
                                        title="Cancel"
                                    >
                                        <X className="w-3.5 h-3.5" style={{ margin: 'auto' }} />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-emerald-600 shadow-lg border-2 border-white cursor-pointer hover:bg-white transition-all duration-200 transform group-hover:scale-110"
                                    onClick={triggerFileInput}
                                >
                                    {/* <Camera className="w-4 h-4" /> */}
                                </div>
                            )}
                        </>
                    )}

             
                    {/* <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isProcessing}
                    /> */}
                </div>

                <div className="space-y-1" style={{marginTop: isMobile ? '8px' : '10px'}}>
                    <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 leading-tight`}>
                        {profileData?.name || 'User'}
                    </h2>
                    <p className={`text-gray-500 ${isMobile ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>{profileData?.email}</p>
                </div>


                {avatarUrl && !isProcessing && (
                    <button
                        onClick={handleRemoveImage}
                        className="mt-3 flex items-center gap-1 text-[10px] font-medium text-red-500 hover:text-red-700 transition-colors py-1 px-3 rounded-full hover:bg-red-50"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span style={{marginTop: '3px'}}>Remove Photo</span>
                    </button>
                )}

                {/* <div className="w-full mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs sm:text-[11px]" style={{ fontSize: isMobile ? '10px' : undefined }}>
                    <span className="text-gray-400">Member since</span>
                    <span className="font-semibold text-gray-700">2023</span>
                </div> */}

            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2 hidden lg:block" style={{ padding: '0px 5px'}}>
                {sections.map((section) => (
                    <button
                        style={{marginBottom: isMobile ? '5px' : '10px'}}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                            activeSection === section.id
                                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center gap-3" style={{ padding: '5px'}}>
                            <div className={`p-2 rounded-lg ${
                                activeSection === section.id ? 'bg-white text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-xs sm:text-sm">{section.label}</span>
                                <span className="block text-xs opacity-70 font-medium">{section.desc}</span>
                            </div>
                        </div>
                        {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                ))}

                <div className="w-full flex justify-center mt-2 pt-2 border-t border-gray-100" style={{ padding: '5px 10px', marginTop: '5px'}}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 p-3 rounded-xl text-red-600 hover:text-red-300 transition-colors"
                    >
                    <div className='w-full flex items-center gap-1 p-3 rounded-xl'>
                        <div className="p-2 rounded-md ">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm sm:text-base" style={{marginTop: '5px'}}>Sign Out</span>
                    </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar" style={{ padding: '2px 0px'}}>
                {sections.map((section) => (
                    <button
                        style={{padding: isMobile ? '2px 10px' : '3px 10px'}}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-none rounded-md font-medium whitespace-nowrap transition-colors ${isMobile ? 'text-[10px]' : 'text-xs'} ${
                            activeSection === section.id
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

        </aside>
    );
};

export default ProfileSidebar;
