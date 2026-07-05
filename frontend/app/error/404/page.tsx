'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/Button';

export default function NotFoundPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-slate-50 dark:bg-slate-950">
      <HelpCircle className="h-16 w-16 text-slate-400 mb-6" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404 - Not Found</h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The resource or route you are looking for does not exist or has been removed.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
