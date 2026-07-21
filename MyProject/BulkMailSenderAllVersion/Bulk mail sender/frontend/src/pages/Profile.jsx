import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// const API_URL = 'http://localhost:6085/api';
const API_URL = 'https://server2.vais.co.in/testb/api';

const DOMAIN_OPTIONS = [
  { value: 'gmail', label: 'Gmail', icon: '📧' },
  { value: 'hostinger', label: 'Hostinger', icon: '🌐' },
  { value: 'godaddy', label: 'GoDaddy', icon: '🚀' },
  { value: 'other', label: 'Other / Custom', icon: '⚙️' },
];

const DOMAIN_HOSTS = {
  gmail: { host: 'smtp.gmail.com', port: 587, secure: false, hint: 'Use an App Password (not your regular password). Go to Google Account → Security → 2FA → App Passwords.' },
  hostinger: { host: 'smtp.hostinger.com', port: 465, secure: true, hint: 'Use your Hostinger email password.' },
  godaddy: { host: 'smtpout.secureserver.net', port: 465, secure: true, hint: 'Use your GoDaddy email password.' },
  other: { host: '', port: '', secure: true, hint: 'Enter your SMTP server details manually.' },
};

const Profile = () => {
  const { user } = useAuth();

  // Profile info state
  const [profile, setProfile] = useState({ companyName: '', address: '', phone: '', website: '', facebook: '', instagram: '', youtube: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Mail accounts state
  const [mailAccounts, setMailAccounts] = useState([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add account form
  const [newAccount, setNewAccount] = useState({
    label: '', domain: 'gmail', email: '', password: '', host: '', port: '', secure: true
  });
  const [addingAccount, setAddingAccount] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile`);
        if (res.data.success) {
          const p = res.data.profile;
            setProfile({
              companyName: p.companyName || '',
              address: p.address || '',
              phone: p.phone || '',
              website: p.website || '',
              facebook: p.facebook || '',
              instagram: p.instagram || '',
              youtube: p.youtube || '',
            });
          if (p.logo) {
            const filename = p.logo.replace(/\\/g, '/').split('/').pop();
            setLogoPreview(`https://server2.vais.co.in/testb/uploads/${filename}`);
          }
        }
      } catch {
        // ignore – empty profile
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch mail accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`${API_URL}/mail-accounts`);
        if (res.data.success) setMailAccounts(res.data.accounts);
      } catch {
        // ignore
      } finally {
        setFetchingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

  // Handle profile save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      // Upload logo if selected
      if (logoFile) {
        const fd = new FormData();
        fd.append('logo', logoFile);
        await axios.post(`${API_URL}/profile/logo`, fd);
      }

      await axios.put(`${API_URL}/profile`, profile);
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle add mail account
  const handleAddAccount = async (e) => {
    e.preventDefault();
    setAddingAccount(true);
    try {
      const payload = { ...newAccount };
      if (newAccount.domain !== 'other') {
        const preset = DOMAIN_HOSTS[newAccount.domain];
        payload.host = preset.host;
        payload.port = preset.port;
        payload.secure = preset.secure;
      }

      const res = await axios.post(`${API_URL}/mail-accounts`, payload);
      if (res.data.success) {
        setMailAccounts([...mailAccounts, res.data.account]);
        toast.success('Mail account added!');
        setShowAddForm(false);
        setNewAccount({ label: '', domain: 'gmail', email: '', password: '', host: '', port: '', secure: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add mail account.');
    } finally {
      setAddingAccount(false);
    }
  };

  // Handle delete mail account
  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Remove this mail account?')) return;
    try {
      await axios.delete(`${API_URL}/mail-accounts/${id}`);
      setMailAccounts(mailAccounts.filter((a) => a._id !== id));
      toast.success('Mail account removed.');
    } catch {
      toast.error('Failed to remove account.');
    }
  };

  const domainInfo = DOMAIN_HOSTS[newAccount.domain];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Profile & Settings</h1>
        <p className="text-slate-400 text-sm">Manage your company info and email sending accounts</p>
      </div>

      {/* ── Company Info Section ── */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-icon">🏢</div>
          <div>
            <h2 className="profile-section-title">Company Information</h2>
            <p className="profile-section-desc">This info appears in your email signature footer</p>
          </div>
        </div>

        {fetchingProfile ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label>Company Name</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  placeholder="VAIS Engineering Pvt Ltd"
                />
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 9999999999"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label>Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="profile-field">
                <label>Facebook URL</label>
                <input
                  type="url"
                  value={profile.facebook}
                  onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="profile-field">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="profile-field">
                <label>YouTube URL</label>
                <input
                  type="url"
                  value={profile.youtube}
                  onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Address</label>
              <textarea
                rows={2}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="123 Business St, City, State – 000000"
              />
            </div>

            {/* Logo upload */}
            <div className="profile-field">
              <label>Company Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-14 w-auto rounded-lg border border-slate-700 bg-slate-800 p-1" />
                )}
                <label className="cursor-pointer logo-upload-btn">
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                  {logoPreview ? '🔄 Change Logo' : '📷 Upload Logo'}
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="profile-save-btn" disabled={profileLoading}>
                {profileLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : '💾 Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Mail Accounts Section ── */}
      <div className="profile-section">
        <div className="profile-section-header">
          <div className="profile-section-icon">📬</div>
          <div>
            <h2 className="profile-section-title">Mail Accounts</h2>
            <p className="profile-section-desc">Add the email accounts you want to send from</p>
          </div>
        </div>

        {/* Existing accounts list */}
        {fetchingAccounts ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mailAccounts.length === 0 && !showAddForm ? (
          <div className="mail-account-empty">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400">No mail accounts added yet.</p>
            <p className="text-slate-500 text-sm">Add one to start sending emails.</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {mailAccounts.map((account) => (
              <div key={account._id} className="mail-account-item">
                <div className="mail-account-left">
                  <div className="mail-account-domain-badge">{account.domain.toUpperCase()}</div>
                  <div>
                    <p className="mail-account-label">{account.label}</p>
                    <p className="mail-account-email">{account.email}</p>
                    <p className="mail-account-host">{account.host}:{account.port}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account._id)}
                  className="mail-account-delete"
                  title="Remove account"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add account form */}
        {showAddForm && (
          <form onSubmit={handleAddAccount} className="add-account-form mt-4">
            <h3 className="text-slate-200 font-semibold mb-4">➕ Add New Mail Account</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label>Label (your nickname for this account)</label>
                <input
                  type="text"
                  value={newAccount.label}
                  onChange={(e) => setNewAccount({ ...newAccount, label: e.target.value })}
                  placeholder="e.g. Company Gmail, Sales Account"
                  required
                />
              </div>

              <div className="profile-field">
                <label>Email Provider / Domain</label>
                <select
                  value={newAccount.domain}
                  onChange={(e) => setNewAccount({ ...newAccount, domain: e.target.value })}
                >
                  {DOMAIN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Provider hint */}
            {domainInfo.hint && (
              <div className="domain-hint">
                💡 {domainInfo.hint}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  placeholder="yourmail@gmail.com"
                  required
                />
              </div>

              <div className="profile-field">
                <label>{newAccount.domain === 'gmail' ? 'App Password' : 'Password'}</label>
                <input
                  type="password"
                  value={newAccount.password}
                  onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                  placeholder={newAccount.domain === 'gmail' ? 'xxxx xxxx xxxx xxxx' : 'Email password'}
                  required
                />
              </div>
            </div>

            {/* Custom SMTP fields for 'other' */}
            {newAccount.domain === 'other' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="profile-field md:col-span-1">
                  <label>SMTP Host</label>
                  <input
                    type="text"
                    value={newAccount.host}
                    onChange={(e) => setNewAccount({ ...newAccount, host: e.target.value })}
                    placeholder="smtp.example.com"
                    required
                  />
                </div>
                <div className="profile-field">
                  <label>Port</label>
                  <input
                    type="number"
                    value={newAccount.port}
                    onChange={(e) => setNewAccount({ ...newAccount, port: e.target.value })}
                    placeholder="465"
                    required
                  />
                </div>
                <div className="profile-field flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccount.secure}
                      onChange={(e) => setNewAccount({ ...newAccount, secure: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>SSL/TLS (Secure)</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <button type="submit" className="profile-save-btn" disabled={addingAccount}>
                {addingAccount ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding...
                  </span>
                ) : 'Add Account'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="profile-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!showAddForm && (
          <button
            className="add-account-trigger mt-4"
            onClick={() => setShowAddForm(true)}
          >
            ➕ Add Mail Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
