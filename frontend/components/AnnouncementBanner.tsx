'use client';

import React, { useEffect, useState } from 'react';
import { Info, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import axios from 'axios';

export const AnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<{
    banner_text: string;
    banner_type: string;
    is_active: boolean;
  } | null>(null);
  const [visible, setVisible] = useState(true);

  const fetchAnnouncement = async () => {
    try {
      // Direct axios call to avoid auth client headers check if calling public route
      const res = await axios.get('http://localhost:8000/api/v1/announcement');
      setAnnouncement(res.data);
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    
    // Poll announcement every 15 seconds to fetch changes dynamically
    const interval = setInterval(fetchAnnouncement, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!announcement || !announcement.is_active || !announcement.banner_text || !visible) {
    return null;
  }

  const getTypeStyles = () => {
    switch (announcement.banner_type) {
      case 'warning':
        return {
          bg: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="h-4 w-4 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-rose-600 text-white',
          icon: <AlertTriangle className="h-4 w-4 shrink-0" />
        };
      case 'success':
        return {
          bg: 'bg-emerald-600 text-white',
          icon: <ShieldCheck className="h-4 w-4 shrink-0" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-600 text-white',
          icon: <Info className="h-4 w-4 shrink-0" />
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`w-full ${styles.bg} transition-all duration-300 py-2.5 px-4 flex items-center justify-between shadow-sm relative z-50`}>
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center text-center text-xs sm:text-sm font-semibold tracking-wide px-8">
        {styles.icon}
        <span>{announcement.banner_text}</span>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-4 hover:opacity-80 p-0.5 rounded transition-all focus:outline-none"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
