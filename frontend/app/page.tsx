import Link from 'next/link';
import { ShieldAlert, Bug, Target, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50 dark:bg-slate-900 -z-10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Intentionally Vulnerable Security Lab</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Master Defensive Security <br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400">By Understanding Vulnerabilities</span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            A comprehensive, intentionally flawed web application built exclusively for local QA testing, security research, and vulnerability remediation training.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="px-8 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
              Start Training Lab
            </Link>
            <Link href="/login" className="px-8 py-3 rounded-lg font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Learn to spot the OWASP Top 10</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our isolated vulnerability modules allow you to safely test for SQL Injection, XSS, Broken Access Control, and more, complete with remediation guides.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center mb-6">
                <Bug size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Identify Flaws</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Use tools like OWASP ZAP and Burp Suite to intercept traffic and discover intentionally exposed injection points.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Execute Test Cases</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Follow our 60+ manual QA test cases designed to cover boundary checks, sanity limits, and malicious payload handling.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Learn Remediation</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Compare vulnerable configurations against secure alternatives built into the application's clean codebase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
