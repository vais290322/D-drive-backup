import React from "react";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";

const Footer = () => (
  <footer
    className="text-center py-4 mt-8"
    style={{ background: PREMIUM_NAVY, color: PREMIUM_GOLD }}
  >
    <div className="font-semibold text-lg tracking-wide">DRASTA &mdash; Empowering Research & Innovation</div>
    <div className="text-xs mt-1" style={{ color: PREMIUM_GOLD, opacity: 0.85 }}>
      Contact: info@drasta.org | +91 12345 67890
    </div>
  </footer>
);

export default Footer; 