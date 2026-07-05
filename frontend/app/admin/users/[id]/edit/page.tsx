'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

const adminEditUserSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  role_id: z.coerce.number().min(1).max(3),
  is_active: z.boolean(),
});

type AdminEditUserValues = z.infer<typeof adminEditUserSchema>;

export default function AdminEditUserPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<AdminEditUserValues>({
    resolver: zodResolver(adminEditUserSchema),
    defaultValues: {
      is_active: true,
      role_id: 3,
    }
  });

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setPageLoading(true);
        const res = await api.get(`/admin/users/${id}`);
        const u = res.data;
        reset({
          first_name: u.profile?.first_name || '',
          last_name: u.profile?.last_name || '',
          email: u.email || '',
          phone: u.profile?.phone || '',
          role_id: u.role_id,
          is_active: u.is_active,
        });
      } catch (err: any) {
        setErrorMsg(extractErrorMessage(err, 'Failed to fetch user details.'));
      } finally {
        setPageLoading(false);
      }
    };

    if (user?.role_id === 1 && id) {
      fetchUserDetail();
    }
  }, [user, id, reset]);

  const onSubmit = async (data: AdminEditUserValues) => {
    try {
      setSuccessMsg(null);
      setErrorMsg(null);
      await api.put(`/admin/users/${id}`, data);
      setSuccessMsg('User configurations updated successfully.');
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to update user.'));
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

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <Breadcrumb items={[
          { label: 'Admin', href: '/admin' },
          { label: 'User Management', href: '/admin/users' },
          { label: 'Edit User' }
        ]} />

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Modify User Configuration
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage system role, account credentials, and lock state.
        </p>

        {successMsg && <Alert type="success" message={successMsg} />}
        {errorMsg && <Alert type="error" message={errorMsg} />}

        <Card title="Account Administration">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                {...register('first_name')}
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                {...register('last_name')}
                error={errors.last_name?.message}
              />
              <Input
                label="Email address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">
                  Access Role
                </label>
                <select
                  {...register('role_id')}
                  className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white sm:text-sm p-2 border"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Manager</option>
                  <option value={3}>User</option>
                </select>
                {errors.role_id?.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role_id.message}</p>
                )}
              </div>

              <div className="flex items-center pt-6">
                <input
                  id="is_active"
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-slate-900 dark:text-slate-300 font-semibold">
                  Account Active (Unchecked = Locked/Disabled)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Configurations
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
