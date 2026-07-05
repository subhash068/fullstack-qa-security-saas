'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Loader } from '@/components/Loader';
import { Alert } from '@/components/Alert';
import { Activity, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/services/api';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optionally fetch dashboard specific data if not covered by the user context
  }, []);

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="p-8 text-center">
        <Alert type="error" message="Please log in to view the dashboard." />
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage your account and explore the security training modules.
        </p>

        {error && <Alert type="error" message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Status</p>
              <div className="flex items-center space-x-2">
                {user.is_active ? (
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={16} className="mr-1" /> Active
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 dark:text-red-400 font-semibold">
                    <XCircle size={16} className="mr-1" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Security Alerts</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                0 Critical
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Recent Activity">
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No recent activity recorded.
            </div>
          </Card>

          <Card title="Account Details">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Role</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {user.role_id === 1 ? 'Administrator' : 'Standard User'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lab Target</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Secured & Monitored
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
