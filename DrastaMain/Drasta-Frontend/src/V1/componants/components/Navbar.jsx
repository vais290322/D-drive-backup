import React, { useRef, useState, useEffect } from "react";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const PREMIUM_GOLD_DARK = "#c89c2b";
const WHITE = "#fff";

const Navbar = ({ user, onShowProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header
      className="shadow flex items-center justify-between px-8 py-4 relative"
      style={{ background: PREMIUM_NAVY }}
    >
      <div className="text-xl font-bold" style={{ color: PREMIUM_GOLD }}>
        C-DRASTA
      </div>
      <div className="flex items-center gap-4 relative">
        <button
          ref={buttonRef}
          className="px-4 py-2 rounded font-semibold transition-colors duration-200 cursor-pointer"
          style={{
            background: PREMIUM_GOLD,
            color: PREMIUM_NAVY,
            border: `1px solid ${PREMIUM_GOLD}`,
          }}
          onClick={() => setOpen((v) => !v)}
          onMouseOver={e => e.currentTarget.style.background = PREMIUM_GOLD_DARK}
          onMouseOut={e => e.currentTarget.style.background = PREMIUM_GOLD}
        >
          Profile
        </button>
        <button
          className="px-4 py-2 rounded font-semibold transition-colors duration-200 cursor-pointer"
          style={{
            background: WHITE,
            color: PREMIUM_NAVY,
            border: `1px solid ${PREMIUM_GOLD}`,
          }}
          onClick={onLogout}
          onMouseOver={e => e.currentTarget.style.background = '#f7e7c1'}
          onMouseOut={e => e.currentTarget.style.background = WHITE}
        >
          Logout
        </button>
        {/* Dropdown */}
        <div
          ref={dropdownRef}
          className={`absolute left-0 top-full mt-2 min-w-[200px] rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out overflow-hidden ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
          style={{
            background: PREMIUM_NAVY,
            border: `1px solid ${PREMIUM_GOLD}`,
            boxShadow: open ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
            color: WHITE,
          }}
        >
          <div className="p-4 flex flex-col items-start gap-1">
            <div className="font-bold text-lg" style={{ color: PREMIUM_GOLD }}>{user?.name || 'Admin'}</div>
            <div className="text-sm" style={{ color: WHITE }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 