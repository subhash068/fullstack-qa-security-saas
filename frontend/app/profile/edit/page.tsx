'use client';

import React, { useState, useEffect } from 'react';
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

const profileEditSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().optional(),
  avatar_url: z.string().url({ message: 'Invalid URL' }).or(z.string().length(0)).optional(),
  bio: z.string().optional(),
  date_of_birth: z.string().optional(),
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function ProfileEditPage() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
  });

  useEffect(() => {
    if (user?.profile) {
      reset({
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        phone: user.profile.phone || '',
        avatar_url: user.profile.avatar_url || '',
        bio: user.profile.bio || '',
        date_of_birth: user.profile.date_of_birth || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileEditFormValues) => {
    try {
      setSuccessMsg(null);
      setErrorMsg(null);
      
      // Clean up optional fields
      const payload = {
        ...data,
        avatar_url: data.avatar_url || null,
        phone: data.phone || null,
        bio: data.bio || null,
        date_of_birth: data.date_of_birth || null,
      };

      await api.put('/profile/', payload);
      await refreshUser();
      setSuccessMsg('Profile details updated successfully.');
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to update profile details.'));
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="p-8"><Alert type="error" message="Please log in." /></div>;

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <Breadcrumb items={[{ label: 'Profile', href: '/profile' }, { label: 'Edit Profile' }]} />
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Edit Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Modify your profile attributes and save changes.
        </p>

        {successMsg && <Alert type="success" message={successMsg} />}
        {errorMsg && <Alert type="error" message={errorMsg} />}

        <Card title="Update Profile Details">
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
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                label="Avatar URL"
                {...register('avatar_url')}
                error={errors.avatar_url?.message}
              />
              <Input
                label="Date of Birth"
                type="date"
                {...register('date_of_birth')}
                error={errors.date_of_birth?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="block w-full rounded-md border-slate-300 dark:border-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white sm:text-sm p-2 border"
              />
              {errors.bio?.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={() => router.push('/profile')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Details
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
