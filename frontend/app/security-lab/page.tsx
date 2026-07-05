'use client';

import React, { useState } from 'react';
import api from '@/services/api';
import { ShieldAlert, Play, Code, Lock, AlertTriangle } from 'lucide-react';

export default function SecurityLabPage() {
  const [labEnabled, setLabEnabled] = useState<boolean | null>(null);
  
  // SQLi state
  const [sqliInput, setSqliInput] = useState("admin@local.com' OR '1'='1");
  const [sqliResult, setSqliResult] = useState<any>(null);
  const [showSqliMitigation, setShowSqliMitigation] = useState(false);

  // XSS state
  const [xssInput, setXssInput] = useState("<script>alert('Vulnerable XSS Executed!')</script>");
  const [xssResult, setXssResult] = useState<string>('');
  const [showXssMitigation, setShowXssMitigation] = useState(false);

  // IDOR state
  const [idorInput, setIdorInput] = useState("aa000000-0000-0000-0000-000000000001");
  const [idorResult, setIdorResult] = useState<any>(null);
  const [showIdorMitigation, setShowIdorMitigation] = useState(false);

  // SSRF state
  const [ssrfInput, setSsrfInput] = useState("http://localhost:8000/api/v1");
  const [ssrfResult, setSsrfResult] = useState<any>(null);
  const [showSsrfMitigation, setShowSsrfMitigation] = useState(false);

  // Cookie Login state
  const [cookieEmail, setCookieEmail] = useState("jane@local.com");
  const [cookieResult, setCookieResult] = useState<any>(null);
  const [showCookieMitigation, setShowCookieMitigation] = useState(false);

  // Weak Reset state
  const [resetEmail, setResetEmail] = useState("john@local.com");
  const [resetResult, setResetResult] = useState<any>(null);
  const [showResetMitigation, setShowResetMitigation] = useState(false);

  // CSRF state
  const [csrfEmail, setCsrfEmail] = useState("attacker@evil.com");
  const [csrfResult, setCsrfResult] = useState<any>(null);
  const [showCsrfMitigation, setShowCsrfMitigation] = useState(false);

  // Environment Leaks
  const [misconfigResult, setMisconfigResult] = useState<any>(null);
  const [showMisconfigMitigation, setShowMisconfigMitigation] = useState(false);

  const checkLabStatus = async () => {
    try {
      const res = await api.get('/');
      setLabEnabled(res.data.vuln_lab_enabled);
    } catch (err) {
      setLabEnabled(false);
    }
  };

  React.useEffect(() => {
    checkLabStatus();
  }, []);

  const triggerSQLi = async () => {
    try {
      setSqliResult({ status: "Pending..." });
      const res = await api.get(`/vuln/sqli/user?email=${encodeURIComponent(sqliInput)}`);
      setSqliResult(res.data);
    } catch (err: any) {
      setSqliResult(err.response?.data || { error: err.message });
    }
  };

  const triggerXSS = () => {
    const url = `${api.defaults.baseURL}/vuln/xss/echo?payload=${encodeURIComponent(xssInput)}`;
    setXssResult(url);
  };

  const triggerIDOR = async () => {
    try {
      setIdorResult({ status: "Pending..." });
      const res = await api.get(`/vuln/access-control/user/${idorInput}`);
      setIdorResult(res.data);
    } catch (err: any) {
      setIdorResult(err.response?.data || { error: err.message });
    }
  };

  const triggerSSRF = async () => {
    try {
      setSsrfResult({ status: "Pending..." });
      const res = await api.get(`/vuln/ssrf/fetch?url=${encodeURIComponent(ssrfInput)}`);
      setSsrfResult(res.data);
    } catch (err: any) {
      setSsrfResult(err.response?.data || { error: err.message });
    }
  };

  const triggerCookieLogin = async () => {
    try {
      setCookieResult({ status: "Pending..." });
      const res = await api.post(`/vuln/auth/cookie-login?email=${encodeURIComponent(cookieEmail)}`);
      setCookieResult(res.data);
    } catch (err: any) {
      setCookieResult(err.response?.data || { error: err.message });
    }
  };

  const triggerWeakReset = async () => {
    try {
      setResetResult({ status: "Pending..." });
      const res = await api.post(`/vuln/auth/weak-reset-request?email=${encodeURIComponent(resetEmail)}`);
      setResetResult(res.data);
    } catch (err: any) {
      setResetResult(err.response?.data || { error: err.message });
    }
  };

  const triggerCSRF = async () => {
    try {
      setCsrfResult({ status: "Pending..." });
      const res = await api.post(`/vuln/csrf/change-email?email=${encodeURIComponent(csrfEmail)}`);
      setCsrfResult(res.data);
    } catch (err: any) {
      setCsrfResult(err.response?.data || { error: err.message });
    }
  };

  const triggerMisconfig = async () => {
    try {
      setMisconfigResult({ status: "Pending..." });
      const res = await api.get('/vuln/misconfig/debug-env');
      setMisconfigResult(res.data);
    } catch (err: any) {
      setMisconfigResult(err.response?.data || { error: err.message });
    }
  };

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-rose-500" />
              OWASP Security Assessment Lab
            </h1>
            <p className="mt-2 text-sm text-slate-500">Educational environment showcasing common vulnerabilities alongside secure code mitigations.</p>
          </div>
          <div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase ${
              labEnabled === true ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Lab Status: {labEnabled === true ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {labEnabled === false && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div>
              <span className="font-semibold block">Vulnerability Lab is Disabled</span>
              <span>All vulnerable endpoints are blocked by default. Set `ENABLE_VULNERABILITY_LAB=true` in your environment config to enable these examples for local educational testing.</span>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {/* SQL INJECTION CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. SQL Injection (SQLi)</h2>
                <p className="text-xs text-slate-500">OWASP A03:2021-Injection</p>
              </div>
              <button
                onClick={() => setShowSqliMitigation(!showSqliMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showSqliMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Exploit Query String</label>
                  <input
                    type="text"
                    value={sqliInput}
                    onChange={(e) => setSqliInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerSQLi}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Execute Vulnerable Query
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">RAW QUERY LOG & RESPONSE:</span>
                <pre>{JSON.stringify(sqliResult, null, 2)}</pre>
              </div>
            </div>

            {showSqliMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Instead of formatting strings directly, use parameterized ORM queries. This maps inputs to typed placeholders that are escaped automatically:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
                  {`# Vulnerable (api/vuln.py)
                  raw_query = f"SELECT * FROM users WHERE email = '{email}'"

                  # Secure (repository/repository.py)
                  db_user = db.query(User).filter(User.email == email).first()`}
                </pre>
              </div>
            )}
          </div>

          {/* CROSS SITE SCRIPTING CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Reflected Cross-Site Scripting (XSS)</h2>
                <p className="text-xs text-slate-500">OWASP A03:2021-Injection</p>
              </div>
              <button
                onClick={() => setShowXssMitigation(!showXssMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showXssMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Payload Injection</label>
                  <textarea
                    rows={2}
                    value={xssInput}
                    onChange={(e) => setXssInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={triggerXSS}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Generate Exploit Link
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-slate-400 block font-semibold">REFLECTED XSS EXPLOIT LINK:</span>
                {xssResult ? (
                  <a
                    href={xssResult}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline break-all block"
                  >
                    {xssResult}
                  </a>
                ) : (
                  <span className="text-slate-500">Not triggered yet</span>
                )}
              </div>
            </div>

            {showXssMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Always return application responses as JSON serialization formats rather than rendering HTML strings. In UI development, rely on safe React variable syntax which auto-escapes HTML tags, and strictly avoid `dangerouslySetInnerHTML`.
                </p>
              </div>
            )}
          </div>

          {/* BROKEN ACCESS CONTROL CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Broken Access Control (IDOR)</h2>
                <p className="text-xs text-slate-500">OWASP A01:2021-Broken Access Control</p>
              </div>
              <button
                onClick={() => setShowIdorMitigation(!showIdorMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showIdorMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">User Account UUID</label>
                  <input
                    type="text"
                    value={idorInput}
                    onChange={(e) => setIdorInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerIDOR}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Query Target Profile ID
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">JSON DATA EXPOSURE RESPONSE:</span>
                <pre>{JSON.stringify(idorResult, null, 2)}</pre>
              </div>
            </div>

            {showIdorMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ensure all REST requests authenticate the session, and explicitly verify that the logged-in user has ownership of the requested resource. For instance, in our profile edit code:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
                  {`# Validate ownership (api/profile.py)
                  if current_user.id != target_user_id:
                      raise HTTPException(status_code=403, detail="Unauthorized access")`}
                </pre>
              </div>
            )}
          </div>

          {/* SERVER-SIDE REQUEST FORGERY (SSRF) CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Server-Side Request Forgery (SSRF)</h2>
                <p className="text-xs text-slate-500">OWASP A10:2021-Server-Side Request Forgery</p>
              </div>
              <button
                onClick={() => setShowSsrfMitigation(!showSsrfMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showSsrfMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Fetch URL</label>
                  <input
                    type="text"
                    value={ssrfInput}
                    onChange={(e) => setSsrfInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerSSRF}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Fetch URL Content
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">SSRF DATA RESPONSE:</span>
                <pre>{JSON.stringify(ssrfResult, null, 2)}</pre>
              </div>
            </div>

            {showSsrfMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Validate target URLs against a strict whitelist of permitted external domains, or configure system firewalls and block private loopback ranges (127.0.0.1, localhost, 10.0.0.0/8, 192.168.0.0/16) at the network wrapper level:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
                  {`from urllib.parse import urlparse
                  import socket

                  # Check hostname resolves to public IP
                  parsed = urlparse(url)
                  ip = socket.gethostbyname(parsed.hostname)
                  if ip.startswith("127.") or ip.startswith("192.168."):
                      raise HTTPException(status_code=400, detail="SSRF attempt blocked")`}
                </pre>
              </div>
            )}
          </div>

          {/* WEAK SESSION COOKIES CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Insecure Session Cookies</h2>
                <p className="text-xs text-slate-500">OWASP A02:2021-Cryptographic Failures</p>
              </div>
              <button
                onClick={() => setShowCookieMitigation(!showCookieMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showCookieMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={cookieEmail}
                    onChange={(e) => setCookieEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerCookieLogin}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Simulate Cookie Login
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">COOKIE SET RESPONSE:</span>
                <pre>{JSON.stringify(cookieResult, null, 2)}</pre>
              </div>
            </div>

            {showCookieMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Always set `httponly=True`, `secure=True`, and `samesite='lax'` (or `'strict'`) flags when writing cookies. This shields tokens from XSS scripts or MitM sniffing:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
                  {`# Secure Cookie Setting
                  response.set_cookie(
                      key="session_token",
                      value=token,
                      httponly=True,   # Shield from document.cookie scripts
                      secure=True,     # Forces HTTPS transmission
                      samesite='lax'   # Restricts CSRF triggers
                  )`}
                </pre>
              </div>
            )}
          </div>

          {/* WEAK PASSWORD RESET CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Predictable Password Reset Tokens</h2>
                <p className="text-xs text-slate-500">OWASP A07:2021-Identification and Authentication Failures</p>
              </div>
              <button
                onClick={() => setShowResetMitigation(!showResetMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showResetMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Account Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerWeakReset}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Initiate Reset Request
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">LEAKED TOKEN OUTPUT:</span>
                <pre>{JSON.stringify(resetResult, null, 2)}</pre>
              </div>
            </div>

            {showResetMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Never leak reset codes directly in JSON API response payloads. Instead, generate a secure random UUID token, hash it inside the database, and transmit it solely through secure communication lines (such as emails):
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono">
                  {`# Secure Token Generation (services/auth_service.py)
                  token = str(uuid.uuid4())
                  hashed = hash_password(token) # Save hash, send cleartext in isolated email`}
                </pre>
              </div>
            )}
          </div>

          {/* CROSS-SITE REQUEST FORGERY (CSRF) CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Cross-Site Request Forgery (CSRF)</h2>
                <p className="text-xs text-slate-500">OWASP A01:2021-Broken Access Control</p>
              </div>
              <button
                onClick={() => setShowCsrfMitigation(!showCsrfMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showCsrfMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">New Email Address</label>
                  <input
                    type="email"
                    value={csrfEmail}
                    onChange={(e) => setCsrfEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={triggerCSRF}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Trigger Cross-Origin State Change
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">CSRF API EXECUTION LOGS:</span>
                <pre>{JSON.stringify(csrfResult, null, 2)}</pre>
              </div>
            </div>

            {showCsrfMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Rely on header-based bearer JWT authentication rather than standard cookies. Since custom HTTP headers (like `Authorization: Bearer &lt;token&gt;`) cannot be automatically read or attached by cross-origin form submissions, this naturally neutralizes CSRF.
                </p>
              </div>
            )}
          </div>

          {/* ENVIRONMENT LEAK CARD */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Security Misconfiguration (Debug Leaks)</h2>
                <p className="text-xs text-slate-500">OWASP A05:2021-Security Misconfiguration</p>
              </div>
              <button
                onClick={() => setShowMisconfigMitigation(!showMisconfigMitigation)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
              >
                <Code className="h-4 w-4" />
                {showMisconfigMitigation ? 'Hide Mitigation' : 'Show Mitigation'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Insecure configurations leak internal setups, environmental credentials, and database structures.
                </p>
                <button
                  onClick={triggerMisconfig}
                  disabled={labEnabled !== true}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Fetch Private Configurations
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 overflow-auto max-h-40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold mb-2">CONFIG EXPOSURE LOGS:</span>
                <pre>{JSON.stringify(misconfigResult, null, 2)}</pre>
              </div>
            </div>

            {showMisconfigMitigation && (
              <div className="bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
                  <Lock className="h-4 w-4" /> Secure Implementation
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Configure production pipelines to strip out debugging routes, never return API variables that dump secrets, and set strict access control boundaries for configurations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
