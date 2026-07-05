'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { extractErrorMessage } from '@/utils/error';
import api from '@/services/api';

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  new_password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      setSuccessMsg(null);
      setErrorMsg(null);
      await api.post('/auth/reset-password', {
        token: data.token,
        new_password: data.new_password,
      });
      setSuccessMsg('Your password has been successfully updated.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to reset password.'));
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Enter the reset code printed in your server logs and choose a new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          {successMsg && <Alert type="success" message={successMsg} />}
          {errorMsg && <Alert type="error" message={errorMsg} />}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Reset Token/Code"
              type="text"
              {...register('token')}
              error={errors.token?.message}
            />

            <Input
              label="New Password"
              type="password"
              {...register('new_password')}
              error={errors.new_password?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirm_password')}
              error={errors.confirm_password?.message}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
