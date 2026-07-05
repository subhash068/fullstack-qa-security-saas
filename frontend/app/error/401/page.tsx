'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-slate-50 dark:bg-slate-950">
      <ShieldAlert className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mb-6" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">401 - Unauthorized</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Your login session has expired or you do not have permission to access this resource. Please sign in to verify your identity.
      </p>
      <Link href="/login">
        <Button>Sign In to Account</Button>
      </Link>
    </div>
  );
}
