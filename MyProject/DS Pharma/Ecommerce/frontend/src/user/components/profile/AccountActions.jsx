import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trash2, AlertTriangle, Lock, Save, X, Loader2 } from 'lucide-react';
import { useLogout } from '@/shared/hooks/useLogout';
import { useToastStore } from '@/store/useToastStore';

// Mock Password Update Service (Replace with actual API call)
const updatePasswordService = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (currentPassword === 'wrong') reject({ message: 'Incorrect current password' });
            else resolve({ success: true, newPassword });
        }, 1500);
    });
};

const AccountActions = () => {
    const logout = useLogout();
    const { success, error } = useToastStore();
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleLogout = (e) => {
        e?.preventDefault();
        logout();
    };

    const handleDeleteAccount = () => {
        // Implement delete account logic here
        // Usually requires an API call
        console.log('Account deleted');
        logout();
    };

    const handlePasswordChange = async () => {
        if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
            error("Please fill in all password fields");
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            error("New passwords do not match");
            return;
        }
        if (passwordData.new.length < 6) {
            error("Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            await updatePasswordService(passwordData.current, passwordData.new);
            success("Password updated successfully");
            setShowChangePassword(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            error(err.message || "Failed to update password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            style={{ marginTop: window.innerWidth >= 640 ? '30px' : '0' }}
        >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ padding: '5px 10px' }}>
                <div className="p-6 border-b border-gray-100 bg-gray-50/30" style={{ marginBottom: '10px'}}>
                    <h2 className="text-lg font-bold text-gray-900">Account Actions</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Manage your account access and data</p>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Change Password Section */}
                    {!showChangePassword ? (
                        <button
                            style={{ padding: '2px 5px', marginBottom: '5px' }}
                            onClick={() => setShowChangePassword(true)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-white transition-colors">
                                    <Lock className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">Change Password</h4>
                                    <p className="text-[10px] sm:text-sm text-gray-500">Update your account password</p>
                                </div>
                            </div>
                            <span className="text-[10px] sm:text-sm font-medium text-emerald-600 group-hover:text-emerald-700">Update</span>
                        </button>
                    ) : (
                        <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-4"
                            style={{ padding: '5px 10px', marginBottom: '5px' }}
                        >
                            <h4 className="text-sm font-bold text-gray-900 mb-2" style={{ padding: '0px 5px' }}>Change Password</h4>
                            <div className="space-y-3" style={{ padding: '5px' }}>
                                {/* Current Password */}
                                <div className="relative" style={{ marginBottom: '10px' }}>
                                    <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">Current Password</label>
                                    <div className="relative">
                                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            value={passwordData.current}
                                            onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                                            className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all hover:border-emerald-300"
                                            style={{ padding: '8px 30px' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* New Password */}
                                    <div className="relative">
                                        <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">New Password</label>
                                        <div className="relative">
                                            <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                value={passwordData.new}
                                                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                                                className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all hover:border-emerald-300"
                                                style={{ padding: '8px 30px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="relative">
                                        <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Re-enter new password"
                                                value={passwordData.confirm}
                                                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                                                className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all hover:border-emerald-300"
                                                style={{ padding: '8px 30px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-2" style={{ padding: '5px' }}>
                                <button
                                    style={{ padding: '2px 5px' }}
                                    onClick={() => setShowChangePassword(false)}
                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span style={{ marginTop: '3px' }}>Cancel</span>
                                </button>
                                <button
                                    style={{ padding: '2px 5px' }}
                                    onClick={handlePasswordChange}
                                    disabled={isChangingPassword}
                                    className="flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span style={{ marginTop: '3px' }}>Save Password</span>
                                </button>
                            </div>
                        </Motion.div>
                    )}

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                        style={{ padding: '2px 5px', marginBottom: '5px' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                <LogOut className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">Sign Out</h4>
                                <p className="text-[10px] sm:text-sm text-gray-500">Sign out of your active session</p>
                            </div>
                        </div>
                        <span className="text-[10px] sm:text-sm font-medium text-gray-600 group-hover:text-gray-900">Sign Out</span>
                    </button>

                    {/* Delete Account Button */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/10 hover:bg-red-50 hover:border-red-200 transition-all group"
                            style={{ padding: '2px 5px', marginBottom: '5px' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xs sm:text-sm font-bold text-red-900">Delete Account</h4>
                                    <p className="text-[10px] sm:text-sm text-red-600/80">Permanently remove your account and data</p>
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-red-600">Delete</span>
                        </button>
                    ) : (
                        <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-5 rounded-xl border border-red-200 bg-red-50"
                            style={{ padding: '10px' }}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                                <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-red-900">Are you absolutely sure?</h4>
                                    <p className="text-[10px] sm:text-sm text-red-700 mt-1">
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </p>
                                </div>
                            </div>
                             <div className="flex gap-3 justify-end">
                                <button
                                    style={{ padding: '2px 10px' }}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-[10px] sm:text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ padding: '2px 10px' }}
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 text-[10px] sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Yes, delete my account
                                </button>
                            </div>
                        </Motion.div>
                    )}
                </div>
            </div>
        </Motion.div>
    );
};

export default AccountActions;
