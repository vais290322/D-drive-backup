import React, { useState, useEffect } from 'react';
import { AnnouncementContext } from './AnnouncementContextInternal';

// Sample initial data (Fallback)
const initialData = {
  marqueeMessages: [
    {
      id: 'marquee-1',
      messages: ['✓ 100% Genuine Medicines', '✓ Express Home Delivery', '✓ Trusted Healthcare Partner'],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Provider component
export const AnnouncementProvider = ({ children }) => {
  const [marqueeMessages, setMarqueeMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount (Backup)
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('ds-pharma-announcements');
        if (stored) {
          const data = JSON.parse(stored);
          setMarqueeMessages(data.marqueeMessages || []);
        } else {
          setMarqueeMessages(initialData.marqueeMessages);
          localStorage.setItem('ds-pharma-announcements', JSON.stringify({
            marqueeMessages: initialData.marqueeMessages
          }));
        }
      } catch (error) {
        console.error('Error loading announcements:', error);
        setMarqueeMessages(initialData.marqueeMessages);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('ds-pharma-announcements', JSON.stringify({ marqueeMessages }));
    }
  }, [marqueeMessages, loading]);

  // Marquee CRUD operations
  const createMarquee = (marqueeData) => {
    const newMarquee = {
      ...marqueeData,
      id: `marquee-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMarqueeMessages(prev => [...prev, newMarquee]);
    return newMarquee;
  };

  const updateMarquee = (id, marqueeData) => {
    setMarqueeMessages(prev => prev.map(marquee =>
      marquee.id === id
        ? { ...marquee, ...marqueeData, updatedAt: new Date().toISOString() }
        : marquee
    ));
  };

  const deleteMarquee = (id) => {
    setMarqueeMessages(prev => prev.filter(marquee => marquee.id !== id));
  };

  const toggleMarqueeStatus = (id) => {
    setMarqueeMessages(prev => prev.map(marquee =>
      marquee.id === id
        ? { ...marquee, isEnabled: !marquee.isEnabled, updatedAt: new Date().toISOString() }
        : marquee
    ));
  };

  const value = {
    marqueeMessages,
    loading,
    createMarquee,
    updateMarquee,
    deleteMarquee,
    toggleMarqueeStatus,
    // Empty placeholders for removed banner operations to prevent breaking legacy imports
    banners: [],
    createBanner: () => {},
    updateBanner: () => {},
    deleteBanner: () => {},
    toggleBannerStatus: () => {}
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};
