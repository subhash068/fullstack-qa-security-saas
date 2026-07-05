'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/Button';

export default function ForbiddenPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-slate-50 dark:bg-slate-950">
      <ShieldX className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">403 - Forbidden</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Access Denied. You do not possess the required security privileges to access this administrative module.
      </p>
      <Link href="/dashboard">
        <Button variant="secondary">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
