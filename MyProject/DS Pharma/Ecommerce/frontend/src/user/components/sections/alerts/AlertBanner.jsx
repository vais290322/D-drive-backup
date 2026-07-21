import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAnnouncements } from '@/shared/contexts/AnnouncementContextInternal';

const AlertBanner = ({ position = 'top'}) => {
  const { alerts } = useAnnouncements();
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Load dismissed alerts from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('ds-pharma-dismissed-alerts');
    if (dismissed) {
      try {
        setDismissedAlerts(JSON.parse(dismissed));
      } catch (error) {
        console.error('Error loading dismissed alerts:', error);
      }
    }
  }, []);

  const handleDismiss = (alertId) => {
    const newDismissed = [...dismissedAlerts, alertId];
    setDismissedAlerts(newDismissed);
    localStorage.setItem('ds-pharma-dismissed-alerts', JSON.stringify(newDismissed));
  };

  // Filter alerts for this position
  const positionAlerts = alerts.filter(alert => {
    // Check if alert is enabled
    if (!alert.isEnabled) return false;
    
    // Check if dismissed
    if (dismissedAlerts.includes(alert.id)) return false;
    
    // Check if expired
    if (alert.expiresAt && new Date(alert.expiresAt) < new Date()) return false;
    
    // Check position
    return alert.position === position;
  });

  if (positionAlerts.length === 0) return null;

  const getAlertStyles = (type) => {
    const styles = {
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-900',
        icon: 'ℹ️'
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-900',
        icon: '✓'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-500',
        text: 'text-yellow-900',
        icon: '⚠️'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-900',
        icon: '✕'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <div className='absolute z-50' style={position === 'top' ? { marginBottom: '40px' } : { marginTop: '100px' }}>
      {positionAlerts.map(alert => {
        const styles = getAlertStyles(alert.type);
        return (
          <div
            key={alert.id}
            className={`${styles.bg} ${styles.border} ${styles.text} border-l-4 p-4 mb-2 rounded-r-lg shadow-sm animate-slideIn`}
            role="alert"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-lg" aria-hidden="true">{styles.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: 'Gyrotrope, sans-serif' }}>
                    {alert.title}
                  </h4>
                  <p className="text-sm" style={{ fontFamily: 'Gyrotrope, sans-serif' }}>
                    {alert.message}
                  </p>
                </div>
              </div>
              {alert.dismissible && (
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="text-current opacity-50 hover:opacity-100 transition-opacity shrink-0"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AlertBanner;
