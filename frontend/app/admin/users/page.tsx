'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Loader } from '@/components/Loader';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Pagination } from '@/components/Pagination';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Edit2, Trash2, Search, UserCheck, ShieldAlert } from 'lucide-react';
import api from '@/services/api';
import { extractErrorMessage } from '@/utils/error';

export default function UserManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      setError(null);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to fetch users.'));
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role_id === 1) {
      fetchUsers();
    } else {
      setPageLoading(false);
    }
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      setError(null);
      setSuccess(null);
      await api.delete(`/admin/users/${id}`);
      setSuccess('User deleted successfully.');
      fetchUsers();
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to delete user.'));
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

  // Filter & Search users
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.profile?.first_name || ''} ${u.profile?.last_name || ''}`.toLowerCase();
    const email = u.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  // Paginated users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      header: 'Name',
      accessor: (row: any) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {row.profile ? `${row.profile.first_name} ${row.profile.last_name}` : row.email}
        </span>
      ),
    },
    { header: 'Email', accessor: 'email' as keyof any },
    {
      header: 'Role',
      accessor: (row: any) => (
        <span className="font-medium text-slate-700 dark:text-slate-350">
          {row.role_id === 1 ? 'Admin' : 'User'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
            row.is_active
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
          }`}
        >
          {row.is_active ? (
            <>
              <UserCheck size={12} className="mr-1" /> Active
            </>
          ) : (
            <>
              <ShieldAlert size={12} className="mr-1" /> Locked
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/admin/users/${row.id}/edit`)}
            className="flex items-center space-x-1 py-1 px-3 text-xs"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </Button>
          {row.id !== user.id && (
            <Button
              variant="danger"
              onClick={() => handleDeleteUser(row.id)}
              className="flex items-center space-x-1 py-1 px-3 text-xs"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'User Management' }]} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Search, view details, modify privileges, or delete laboratory user accounts.
            </p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <Card>
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 max-w-md mb-6">
            <Search className="text-slate-400 mr-2 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-0 p-0 focus:ring-0 w-full text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>

          <Table data={paginatedUsers} columns={columns} keyExtractor={(row) => row.id} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>
    </div>
  );
}
