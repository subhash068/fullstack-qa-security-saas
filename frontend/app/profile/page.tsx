'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Loader } from '@/components/Loader';
import { Edit, Key, User as UserIcon, Calendar, Mail, Phone, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <div className="p-8"><Alert type="error" message="Please log in." /></div>;

  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`;
  const avatarUrl = user.profile?.avatar_url || defaultAvatar;

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display">
          User Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Overview of your account credentials and personal information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-28 w-28 rounded-full border-4 border-indigo-100 dark:border-slate-800 shadow-sm mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
              <Shield size={14} className="mr-1" />
              {user.role_id === 1 ? 'Administrator' : user.role_id === 2 ? 'Manager' : 'Standard User'}
            </p>
            {user.profile?.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-450 mt-4 italic">
                "{user.profile.bio}"
              </p>
            )}
          </Card>

          {/* Details Card */}
          <div className="md:col-span-2 space-y-6">
            <Card title="Account Information">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <Mail size={16} className="mr-2 text-slate-400" /> Email address
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <Phone size={16} className="mr-2 text-slate-400" /> Phone number
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.profile?.phone || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <Calendar size={16} className="mr-2 text-slate-400" /> Date of Birth
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.profile?.date_of_birth || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <UserIcon size={16} className="mr-2 text-slate-400" /> Last login session
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'First session'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link href="/profile/edit">
                  <Button className="flex items-center space-x-2">
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
                <Link href="/profile/change-password">
                  <Button variant="secondary" className="flex items-center space-x-2">
                    <Key size={16} />
                    <span>Change Password</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
