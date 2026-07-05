'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { CreditCard, Check, Receipt, RefreshCw, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  organization_id: string;
  plan_name: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const subRes = await api.get('/subscriptions');
      setSubscriptions(subRes.data);
      
      const invRes = await api.get('/subscriptions/invoices');
      setInvoices(invRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulatePayment = async (subId: string) => {
    try {
      setMessage('Processing sandbox transaction simulation...');
      const res = await api.post(`/subscriptions/simulate-payment?subscription_id=${subId}&amount=999.00`);
      setMessage(res.data.message);
      await fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Sandbox simulation failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-500 font-medium">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Subscription & Billing</h1>
          <p className="mt-2 text-sm text-slate-500">Review plans, invoice histories, and execute sandbox payments to test subscription status logic changes.</p>
        </div>

        {message && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active plan column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-500" />
                Active Subscription Status
              </h2>

              {subscriptions.length === 0 ? (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 text-amber-800 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-sm">No Active Subscriptions</span>
                    <span className="text-xs">No active pricing tiers detected for this tenant.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">{sub.plan_name}</span>
                          <span className="block text-xs text-slate-400 font-mono">Subscription ID: {sub.id}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-500 grid grid-cols-2 gap-2 border-t border-slate-250/50 dark:border-slate-800 pt-3">
                        <div>
                          <span className="text-xs text-slate-400 block uppercase font-semibold">Period Start</span>
                          <span>{new Date(sub.current_period_start).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block uppercase font-semibold">Period End</span>
                          <span>{new Date(sub.current_period_end).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-3">
                        <button
                          onClick={() => handleSimulatePayment(sub.id)}
                          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Simulate Renewal ($999.00 USD)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Invoices panel */}
            <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-500" />
                Invoice Billing History
              </h2>
              {invoices.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No historical records found for this account.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="py-4 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block text-sm">{inv.invoice_number}</span>
                        <span className="text-xs text-slate-400">{new Date(inv.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">${inv.amount.toFixed(2)} USD</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xxs font-bold ${
                          inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing tiers sidebar */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800 h-fit space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Available SaaS Plans</h3>
            <div className="space-y-4">
              <div className="border border-indigo-600 rounded-xl p-4 bg-indigo-50/10 relative">
                <span className="absolute top-3 right-3 text-xxs bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">Enterprise</span>
                <h4 className="font-bold text-indigo-600 text-sm">Enterprise Tier</h4>
                <div className="my-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">$999</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> Unlimited Orgs & Teams</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> Secure File manager integrations</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> Full DML audit trails access</li>
                </ul>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Pro Tier</h4>
                <div className="my-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">$199</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> Up to 3 teams</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> File manager</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-indigo-500" /> AI chat support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
