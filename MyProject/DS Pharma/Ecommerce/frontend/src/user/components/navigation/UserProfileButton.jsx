import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

/**
 * User profile button component with avatar and greeting
 */
export const UserProfileButton = ({ isAuthenticated, user, className = '', showName = true }) => {
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (!isAuthenticated || !user) return 'Login';
    const firstName = user.name?.split(' ')[0] || 'User';
    return `Hi, ${firstName}`;
  };

  return (
    <button
      aria-label="User profile"
      tabIndex={0}
      type="button"
      onClick={() => {
        if (!isAuthenticated) return navigate('/login');
        if (user?.role === 'admin') return navigate('/admin/dashboard');
        return navigate('/profile');
      }}
      className={`flex items-center gap-2.5 bg-white rounded-full py-1.5 pl-1.5 pr-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer border-none transition-all duration-200 ease-out outline-none hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:outline-2 focus:outline-black/30 focus:outline-offset-2 ${className}`}
    >
      <div className="w-[30px] h-7 lg:w-[38px] lg:h-[35px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <User size={16} strokeWidth={2.5} color="#000000" />
        )}
      </div>
      {showName && (
        <span 
          className="font-sans text-md font-medium text-black tracking-[0.01em]"
          style={{ paddingRight: '1rem' }}
        >
          {getDisplayName()}
        </span>
      )}
    </button>
  );
};
