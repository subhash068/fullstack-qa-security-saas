'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { AnnouncementBanner } from './AnnouncementBanner';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const active = pathname === path || pathname?.startsWith(path + '/');
    return active
      ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-all"
      : "border-transparent text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all";
  };

  return (
    <>
      <AnnouncementBanner />
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ShieldAlert className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  SecLab SaaS
                </span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user && (
                <>
                  <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link href="/organization" className={getLinkClass('/organization')}>
                    Organization
                  </Link>
                  <Link href="/billing" className={getLinkClass('/billing')}>
                    Billing
                  </Link>
                  <Link href="/files" className={getLinkClass('/files')}>
                    Files
                  </Link>
                  <Link href="/chat" className={getLinkClass('/chat')}>
                    AI Chat
                  </Link>
                  <Link href="/security-lab" className={getLinkClass('/security-lab')}>
                    Security Lab
                  </Link>
                  {user.role_id === 1 && (
                    <Link href="/admin" className={getLinkClass('/admin')}>
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <UserIcon className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Log in
                </Link>
                <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};
