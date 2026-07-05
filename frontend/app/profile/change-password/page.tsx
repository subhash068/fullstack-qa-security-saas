'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Loader } from '@/components/Loader';
import { extractErrorMessage } from '@/utils/error';
import api from '@/services/api';

const changePasswordSchema = z.object({
  old_password: z.string().min(1, { message: 'Old password is required' }),
  new_password: z.string().min(8, { message: 'New password must be at least 8 characters' }),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      setSuccessMsg(null);
      setErrorMsg(null);
      await api.put('/profile/change-password', {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      setSuccessMsg('Password updated successfully.');
      reset();
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to change password.'));
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="p-8"><Alert type="error" message="Please log in." /></div>;

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <Breadcrumb items={[{ label: 'Profile', href: '/profile' }, { label: 'Change Password' }]} />

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Change Password
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Protect your account by setting a strong, secure password.
        </p>

        {successMsg && <Alert type="success" message={successMsg} />}
        {errorMsg && <Alert type="error" message={errorMsg} />}

        <Card title="Update Credentials">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              {...register('old_password')}
              error={errors.old_password?.message}
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

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={() => router.push('/profile')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
