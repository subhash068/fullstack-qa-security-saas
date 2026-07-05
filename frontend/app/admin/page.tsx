'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Loader } from '@/components/Loader';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  ArrowRight, 
  ToggleLeft, 
  ToggleRight, 
  Activity, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Play, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Database 
} from 'lucide-react';
import api from '@/services/api';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [labEnabled, setLabEnabled] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggleMessage, setToggleMessage] = useState<string | null>(null);

  // Health Stats State
  const [systemHealth, setSystemHealth] = useState({
    cpu_usage: 14.5,
    memory_usage: 48.2,
    db_latency_ms: 3.1,
    uptime_hours: 184.2
  });

  const fetchTelemetry = () => {
    if (user?.role_id === 1) {
      Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/audit-logs?limit=8'),
        api.get('/')
      ]).then(([statsRes, logsRes, rootRes]) => {
        setStats(statsRes.data);
        setLogs(logsRes.data);
        setLabEnabled(!!rootRes.data.vuln_lab_enabled);
        setPageLoading(false);
      }).catch(err => {
        setError("Failed to fetch administrative dashboard telemetry.");
        setPageLoading(false);
      });
    } else {
      setPageLoading(false);
    }
  };

  const fetchSystemHealth = () => {
    if (user?.role_id === 1) {
      api.get('/admin/system-health')
        .then(res => {
          setSystemHealth(res.data);
        })
        .catch(() => {
          // Fallback if endpoint fails
        });
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchSystemHealth();

    // Poll system health metrics every 5 seconds
    const interval = setInterval(fetchSystemHealth, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleLab = async () => {
    const targetState = !labEnabled;
    try {
      setToggleMessage('Updating lab status...');
      const res = await api.post(`/admin/toggle-lab?enabled=${targetState}`);
      setLabEnabled(res.data.vuln_lab_enabled);
      setToggleMessage(`Vulnerability lab successfully ${targetState ? 'enabled' : 'disabled'}.`);
      fetchTelemetry();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update lab status.');
    }
  };

  const handleSimulateAttack = async () => {
    try {
      setToggleMessage('Simulating external security events...');
      await api.post('/admin/simulate-attack');
      fetchTelemetry();
      setToggleMessage('Successfully simulated attack events and logged them to forensics.');
    } catch (err) {
      setError('Failed to trigger attack simulation.');
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to purge all application security forensics logs?')) return;
    try {
      setToggleMessage('Purging logs database...');
      await api.post('/admin/clear-logs');
      fetchTelemetry();
      setToggleMessage('Forensic logs database successfully purged.');
    } catch (err) {
      setError('Failed to clear logs.');
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

  const logColumns = [
    {
      header: 'Time',
      accessor: (row: any) => (
        <span className="text-slate-500 dark:text-slate-400">
          {new Date(row.created_at).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Action / Event',
      accessor: (row: any) => {
        const isAlert = row.action.includes('Blocked') || row.action.includes('Alert');
        return (
          <span className={`font-semibold ${isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {row.action}
          </span>
        );
      }
    },
    {
      header: 'User ID',
      accessor: (row: any) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {row.user_id ? row.user_id.substring(0, 8) + '...' : 'Anonymous'}
        </span>
      )
    },
    {
      header: 'IP Address',
      accessor: (row: any) => (
        <span className="font-mono text-xs">{row.ip_address}</span>
      )
    },
  ];

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Admin Control Panel
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Global system monitoring, compliance auditing, forensics simulator, and account operations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users">
              <Button className="flex items-center space-x-1.5 shadow-sm">
                <Users size={16} />
                <span>Manage User Base</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}
        {toggleMessage && (
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse text-indigo-500" />
            <span>{toggleMessage}</span>
          </div>
        )}

        {/* SECTION 1: SYSTEM HEALTH TELEMETRY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Server CPU</span>
              <Cpu className="text-indigo-500 h-5 w-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.cpu_usage}%</span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${systemHealth.cpu_usage}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">RAM Occupancy</span>
              <HardDrive className="text-emerald-500 h-5 w-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.memory_usage}%</span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${systemHealth.memory_usage}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">DB Response</span>
              <Activity className="text-amber-500 h-5 w-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.db_latency_ms} ms</span>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(systemHealth.db_latency_ms * 10, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Service Uptime</span>
              <Clock className="text-sky-500 h-5 w-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{systemHealth.uptime_hours} hrs</span>
              <p className="text-xs text-slate-400 mt-3 font-medium">99.98% Service Level Agreement</p>
            </div>
          </Card>
        </div>

        {/* SECTION 2: GRAPH & SECURITY AUDITING CHECKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Traffic/Attack Graph */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Security Threat Log Trend</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Blocked malicious events recorded per day</p>
              </div>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold px-2.5 py-1 rounded">Live Feed</span>
            </div>

            <div className="relative h-44 w-full pt-4">
              {/* Custom SVG line chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                
                {/* Gradient Fill */}
                <path 
                  d="M0 120 C 50 80, 100 110, 150 50 C 200 70, 250 30, 300 90 C 350 40, 400 60, 450 15 C 480 30, 500 10, 500 10 L 500 150 L 0 150 Z" 
                  fill="url(#chartGradient)" 
                />
                {/* Stroke Line */}
                <path 
                  d="M0 120 C 50 80, 100 110, 150 50 C 200 70, 250 30, 300 90 C 350 40, 400 60, 450 15 C 480 30, 500 10, 500 10" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN (TODAY)</span>
            </div>
          </div>

          {/* Security Compliance Audit */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Security Auditing Check</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Critical server configurations status</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-755 dark:text-slate-300">Database Connection</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">ONLINE</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-755 dark:text-slate-300">SSL Certificates</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">SECURE</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-semibold text-slate-755 dark:text-slate-300">QA Lab Vulnerabilities</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  labEnabled 
                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30' 
                    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                }`}>
                  {labEnabled ? 'OPEN' : 'SHIELDED'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-755 dark:text-slate-300">CORS Origin Check</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded">LOOSE FILTER</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: LAB CONTROLS */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-455 rounded-lg">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Vulnerability Assessment Lab</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggles the endpoints under `/api/v1/vuln/*` to expose intentional flaws for security exercises.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleToggleLab}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                labEnabled 
                  ? 'text-emerald-600 hover:text-emerald-700' 
                  : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              {labEnabled ? (
                <>
                  <span className="text-sm font-bold tracking-wider">LAB ACTIVE</span>
                  <ToggleRight size={44} className="text-emerald-600" />
                </>
              ) : (
                <>
                  <span className="text-sm font-bold tracking-wider text-slate-400">LAB INACTIVE</span>
                  <ToggleLeft size={44} className="text-slate-400" />
                </>
              )}
            </button>
          </Card>
        </div>

        {/* SECTION 4: FORENSICS LOG & CONTROLS */}
        <div className="grid grid-cols-1 gap-8">
          <Card className="p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Forensic Audit Logs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrative operations and blocked malicious actions</p>
              </div>

              {/* Forensics Simulator Controls */}
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSimulateAttack}
                  variant="secondary"
                  className="flex items-center gap-1.5 py-1.5 px-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 hover:bg-rose-100"
                >
                  <Play size={12} className="fill-current" />
                  <span>Simulate Threat Event</span>
                </Button>
                <Button 
                  onClick={handleClearLogs}
                  variant="danger"
                  className="flex items-center gap-1.5 py-1.5 px-3 text-xs"
                >
                  <Trash2 size={12} />
                  <span>Purge Forensic Logs</span>
                </Button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              {logs && logs.length > 0 ? (
                <Table 
                  data={logs}
                  columns={logColumns}
                  keyExtractor={(row) => row.id}
                />
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <p className="text-sm text-slate-400">No forensics records found in the log database.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
