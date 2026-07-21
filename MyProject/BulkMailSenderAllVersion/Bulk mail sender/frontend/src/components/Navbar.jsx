import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'New Campaign', icon: '✉️' },
    { to: '/campaigns', label: 'History', icon: '📋' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M6 10l10 8 10-8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 10h20v14H6z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>BulkMailer</span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                <span className="navbar-link-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: user info or auth links */}
        <div className="navbar-right">
          {user ? (
            <div className="navbar-user">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="navbar-avatar" />
              ) : (
                <div className="navbar-avatar-initial">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="navbar-user-info">
                <p className="navbar-user-name">{user.name}</p>
                <p className="navbar-user-email">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="navbar-link">Sign In</Link>
              <Link to="/register" className="navbar-register-btn">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;