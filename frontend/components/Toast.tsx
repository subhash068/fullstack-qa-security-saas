'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, type, title, message, duration = 5000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />,
  };

  const borderColors = {
    success: 'border-emerald-500 dark:border-emerald-700',
    error: 'border-red-500 dark:border-red-700',
    warning: 'border-amber-500 dark:border-amber-700',
    info: 'border-indigo-500 dark:border-indigo-700',
  };

  return (
    <div
      className={`flex items-start p-4 bg-white dark:bg-slate-900 border-l-4 rounded-r-lg shadow-lg max-w-sm w-full transition-all duration-300 transform translate-x-0 ${borderColors[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-grow">
        {title && <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
