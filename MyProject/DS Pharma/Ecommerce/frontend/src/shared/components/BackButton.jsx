import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Modern, reusable Back button with fallback navigation logic.
 * 
 * @param {Object} props
 * @param {string} props.fallbackRoute - The route to navigate to if there is no browser history.
 * @param {string} [props.label="Back"] - Optional label for the button.
 * @param {string} [props.className=""] - Additional CSS classes.
 */
const BackButton = ({ fallbackRoute = '/', label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // According to requirements: If history length > 1 → navigate(-1), Else → navigate(fallbackRoute)
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackRoute);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center gap-1 px-4 py-2 rounded-full 
        bg-white/90 backdrop-blur-sm border border-gray-200 
        text-gray-700 font-medium transition-all duration-200 
        hover:bg-white hover:shadow-md hover:border-emerald-200
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        cursor-pointer z-10 ${className}`}
      aria-label="Go back"
      style={{ fontFamily: 'Gyrotrope', padding: '0px 5px' }}
    >
      <ArrowLeft 
        size={18} 
        className="transition-transform group-hover:-translate-x-1 text-emerald-600" 
      />
      {label && <span className="text-sm pt-0.5" style={{marginTop: '5px'}}>{label}</span>}
    </button>
  );
};

export default BackButton;
