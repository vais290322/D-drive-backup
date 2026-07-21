import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../common/api.js";
import { setUserDetails } from "../utils/auth/authSlice.js";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  User,
  Settings,
  Lock,
  Wallet,
  Sun,
  Moon,
  Save,
  Loader2
} from "lucide-react";

const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    initialOpeningBalance: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "", // Optional backend verification
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        initialOpeningBalance: user.initialOpeningBalance !== undefined ? user.initialOpeningBalance : 0
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.username || !profileData.email) {
      return toast.error("Username and email are required");
    }

    try {
      setProfileLoading(true);
      const response = await api.put("/auth/profile", {
        username: profileData.username,
        email: profileData.email,
        initialOpeningBalance: parseFloat(profileData.initialOpeningBalance) || 0
      });

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully");
        dispatch(setUserDetails(response.data.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      return toast.error("Please fill all password fields");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      setPasswordLoading(true);
      const response = await api.put("/auth/profile", {
        password: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
          General Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure initial opening balance carryforwards, manage profile detail logs, and dark mode toggles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar-like menu cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Personalisation</h3>
            <button
              onClick={toggleTheme}
              className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-yellow-500" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
                Theme Preference
              </span>
              <span className="text-xs uppercase bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-muted-foreground font-semibold">
                {theme}
              </span>
            </button>
          </div>

          <div className="p-5 bg-gradient-to-br from-purple-600/10 to-blue-500/10 border border-purple-500/20 rounded-2xl space-y-2.5">
            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
              <Wallet className="w-4.5 h-4.5" />
              Cascading Balance Info
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Updating your <b>Initial Opening Balance</b> will trigger a chronological update. Every single ledger day will automatically adjust in order, carrying the new total forward!
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b dark:border-border/20 pb-4 text-slate-800 dark:text-slate-100">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Account Profiles & Balance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Edit username, email, and starting cash reserves.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Username</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-purple-500" />
                  Initial Opening Balance (INR)
                </label>
                <input
                  type="number"
                  name="initialOpeningBalance"
                  value={profileData.initialOpeningBalance}
                  onChange={handleProfileChange}
                  placeholder="0"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {profileLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b dark:border-border/20 pb-4 text-slate-800 dark:text-slate-100">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Security Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Update account passwords.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Enter new strong password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {passwordLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Lock className="w-4.5 h-4.5" />}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
