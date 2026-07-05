'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Building2, Plus, Users, Shield, PlusCircle, Trash2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Team {
  id: string;
  name: string;
  organization_id: string;
}

export default function OrganizationPage() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrgs = async () => {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data);
      if (res.data.length > 0 && !selectedOrg) {
        setSelectedOrg(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (orgId: string) => {
    try {
      const res = await api.get(`/teams?organization_id=${orgId}`);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchTeams(selectedOrg.id);
    }
  }, [selectedOrg]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgSlug) return;
    try {
      const res = await api.post('/organizations', {
        name: newOrgName,
        slug: newOrgSlug
      });
      setOrganizations([...organizations, res.data]);
      setSelectedOrg(res.data);
      setNewOrgName('');
      setNewOrgSlug('');
      setMessage('Organization created successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to create organization');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !selectedOrg) return;
    try {
      const res = await api.post('/teams', {
        name: newTeamName,
        organization_id: selectedOrg.id
      });
      setTeams([...teams, res.data]);
      setNewTeamName('');
      setMessage('Team created successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to create team');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !selectedOrg) return;
    // Simulate membership invite
    try {
      setMessage(`Mock invite sent to ${inviteEmail} for organization ${selectedOrg.name}`);
      setInviteEmail('');
    } catch (err) {
      setMessage('Failed to invite member');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-500">Loading organizations...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Organization & Multi-Tenancy</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your workspace boundaries, isolate resource permissions, and manage collaborative engineering teams.</p>
        </div>

        {message && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Org creation & selection */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-500" />
                Select Organization
              </h2>
              {organizations.length === 0 ? (
                <p className="text-sm text-slate-500">No organizations found. Create one below to begin.</p>
              ) : (
                <div className="space-y-2">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setSelectedOrg(org)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        selectedOrg?.id === org.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {org.name} <span className="opacity-70 text-xs block font-mono font-light">slug: {org.slug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-500" />
                New Organization
              </h2>
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="e.g. Stark Enterprises"
                    className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    value={newOrgSlug}
                    onChange={(e) => setNewOrgSlug(e.target.value)}
                    placeholder="e.g. stark-ent"
                    className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  Create
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Teams & Members inside selected organization */}
          <div className="lg:col-span-2 space-y-6">
            {selectedOrg ? (
              <>
                <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="h-6 w-6 text-indigo-500" />
                      {selectedOrg.name} Teams
                    </h2>
                  </div>

                  {teams.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No engineering teams defined for this organization tenant.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {teams.map((team) => (
                        <div key={team.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{team.name}</span>
                            <span className="text-xs text-slate-400 block font-mono">ID: {team.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleCreateTeam} className="border-t border-slate-100 dark:border-slate-850 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Add Team</h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="e.g. Core Platform QA"
                        className="flex-grow rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                      >
                        Add Team
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield className="h-6 w-6 text-indigo-500" />
                    Invite Members
                  </h2>
                  <form onSubmit={handleInviteMember} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <div className="flex gap-4 mt-1">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="e.g. engineer@local.test"
                          className="flex-grow rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                        >
                          Invite
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-8 border border-dashed border-slate-300 dark:border-slate-800 text-center">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Please select or create an organization to view detailed configurations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
