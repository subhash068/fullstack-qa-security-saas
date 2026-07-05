'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Loader } from '@/components/Loader';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { Shield, ShieldAlert, Settings as SettingsIcon, Megaphone } from 'lucide-react';
import api from '@/services/api';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Announcement State
  const [bannerText, setBannerText] = useState('');
  const [bannerType, setBannerType] = useState('info');
  const [isActive, setIsActive] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user?.role_id === 1) {
      const rootUrl = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/v1\/?$/, '') : 'http://localhost:8000';
      
      Promise.all([
        api.get(rootUrl || '/'),
        api.get('/announcement')
      ])
      .then(([configRes, announceRes]) => {
        setConfig(configRes.data);
        setBannerText(announceRes.data.banner_text || '');
        setBannerType(announceRes.data.banner_type || 'info');
        setIsActive(announceRes.data.is_active ?? true);
        setPageLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch system configurations");
        setPageLoading(false);
      });
    } else {
      setPageLoading(false);
    }
  }, [user]);

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage(null);
      await api.post('/admin/announcement', {
        banner_text: bannerText,
        banner_type: bannerType,
        is_active: isActive
      });
      setSuccessMessage('Dashboard announcement banner successfully updated!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update system announcement banner.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading || pageLoading) return <Loader />;

  if (!user || user.role_id !== 1) {
    return (
      <div className="p-8 text-center">
        <Alert type="error" message="Access denied. Administrator privileges required." />
      </div>
    );
  }

  const isVulnLabEnabled = config?.vuln_lab_enabled;

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <SettingsIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              System Settings
            </h1>
            <p className="text-sm text-slate-500">Configure global platform announcements, lab parameters, and node details.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        {/* Dynamic Announcement Customizer */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Megaphone className="h-5 w-5 text-indigo-600 dark:text-indigo-455" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Dashboard Announcement Customizer</h3>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-5">
            <div>
              <label htmlFor="banner-text" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Announcement Message Text
              </label>
              <textarea
                id="banner-text"
                rows={3}
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter system announcement text..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="banner-type" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Banner Color/Style (Type)
                </label>
                <select
                  id="banner-type"
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                >
                  <option value="info">Info (Indigo/Blue)</option>
                  <option value="success">Success (Emerald/Green)</option>
                  <option value="warning">Warning (Amber/Yellow)</option>
                  <option value="error">Error/Danger (Rose/Red)</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <label htmlFor="is-active" className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                    Activate System Banner Page-Wide
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saveLoading} className="px-5">
                {saveLoading ? 'Saving changes...' : 'Save Announcement Banner'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vulnerability Lab Control */}
          <Card title="Vulnerability Lab Status">
            <div className="mt-4 flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                {isVulnLabEnabled ? (
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vulnerability Module: {isVulnLabEnabled ? 'ENABLED' : 'DISABLED'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Controls whether the intentionally weak OWASP endpoints (/api/v1/vuln/*) are active.
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-white">How to change:</span>
                <p className="mt-1 text-xs">
                  Set the environment variable <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">ENABLE_VULNERABILITY_LAB</code> in your backend process environment to <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">true</code> or <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">false</code> and restart the backend server.
                </p>
              </div>
            </div>
          </Card>

          {/* System Information */}
          <Card title="Server Details">
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Application Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">{config?.message ? "SecLab QA Backend" : "Loading..."}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Database Engine</span>
                <span className="font-semibold text-slate-900 dark:text-white">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Environment</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  Local / Debug
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Lab Security Warning */}
        <Card title="Lab Operations Checklist" className="border-red-200 dark:border-red-950">
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please ensure the following security best practices are followed during your automated testing and security QA analysis:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">1. Network Isolation</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Keep the application bound to <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">localhost</code> or private local subnets. Do not expose these ports to the internet.
                </p>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">2. Separate Test Database</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Use only mock/seeded database records. Avoid entering any real production details or customer PII.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
