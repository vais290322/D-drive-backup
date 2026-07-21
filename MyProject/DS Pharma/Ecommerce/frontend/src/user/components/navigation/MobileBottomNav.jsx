import { motion as Motion } from 'framer-motion';
import { User } from 'lucide-react';

/**
 * Mobile bottom navigation component (React Native style)
 */
export const MobileBottomNav = ({ activeItem, onNavClick, navItems }) => {
  const handleKeyDown = (event, itemName, href) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavClick(itemName, href);
    }
  };

  const allItems = [
    ...navItems,
    { name: "Profile", href: "/profile", icon: User }
  ];

  return (
    <Motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      role="navigation"
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="bg-[rgba(165,232,220,0.95)] backdrop-blur-md border-t border-white/20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <div className="flex items-center justify-around max-w-7xl mx-auto">
          {allItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.name || (item.name === 'Profile' && window.location.pathname === '/profile');

            return (
              <a
                key={item.name}
                href={item.href}
                tabIndex={0}
                role="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.name, item.href);
                }}
                onKeyDown={(e) => handleKeyDown(e, item.name, item.href)}
                className={`
                  flex flex-col items-center justify-center gap-1
                 px-2 py-1 rounded-lg
                  transition-all duration-200 ease-out
                  ${isActive ? 'text-black' : 'text-gray-700'}
                  active:scale-95
                  focus:outline-2 focus:outline-black/30 focus:outline-offset-1
                `}
                style={{ minWidth: '50px' }}
              >
                <IconComponent
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={isActive ? '#000000' : '#4B5563'}
                />
                <span
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: '1',
                  }}
                >
                  {item.name}
                </span>
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      marginTop: '2px'
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </Motion.nav>
  );
};
