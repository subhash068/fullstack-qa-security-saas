import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
