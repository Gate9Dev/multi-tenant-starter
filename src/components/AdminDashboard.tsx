import React, { useEffect, useState } from 'react';
import { Users, Building2, Plus, UserPlus, LogOut } from 'lucide-react';
import { getAllTenants, getTenantAdmins, addTenantAdmin } from '../lib/db';
import { Button } from './ui/Button';
import { AddTenantModal } from './AddTenantModal';
import { AddAdminModal } from './AddAdminModal';
import { useAuthStore } from '../store/authStore';

interface Tenant {
  id: number;
  tenant: string;
  userCount: number;
}

interface TenantAdmin {
  id: number;
  email: string;
  created_at: string;
}

export function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantAdmins, setTenantAdmins] = useState<TenantAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminList, setShowAdminList] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const logout = useAuthStore(state => state.logout);

  const loadTenants = async () => {
    try {
      const tenantsData = await getAllTenants();
      setTenants(tenantsData as Tenant[]);
    } catch (error) {
      console.error('Failed to load tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTenantAdmins = async (tenantId: number) => {
    try {
      const admins = await getTenantAdmins(tenantId);
      setTenantAdmins(admins as TenantAdmin[]);
    } catch (error) {
      console.error('Failed to load tenant admins:', error);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    if (selectedTenant && showAdminList) {
      loadTenantAdmins(selectedTenant.id);
    }
  }, [selectedTenant, showAdminList]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Site Administration</h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsAddTenantModalOpen(true)}
            icon={Plus}
          >
            Add Tenant
          </Button>
          <Button
            onClick={logout}
            icon={LogOut}
            variant="secondary"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Tenant Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage tenants and their administrators</p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-white overflow-hidden shadow rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedTenant(tenant);
                  setShowAdminList(true);
                }}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {tenant.tenant}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {tenant.userCount}
                          </div>
                          <div className="ml-2 text-sm text-gray-500">users</div>
                        </dd>
                      </dl>
                    </div>
                    <Button
                      variant="secondary"
                      icon={UserPlus}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTenant(tenant);
                        setIsAddAdminModalOpen(true);
                      }}
                    >
                      Add Admin
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTenantModal
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
        onTenantAdded={loadTenants}
      />

      {selectedTenant && (
        <AddAdminModal
          isOpen={isAddAdminModalOpen}
          onClose={() => {
            setIsAddAdminModalOpen(false);
            setSelectedTenant(null);
          }}
          tenant={selectedTenant}
          onAdminAdded={() => {
            loadTenants();
            if (showAdminList) {
              loadTenantAdmins(selectedTenant.id);
            }
          }}
        />
      )}

      {/* Tenant Admins List Modal */}
      {showAdminList && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Administrators of {selectedTenant.tenant}
              </h2>
              <button
                onClick={() => {
                  setShowAdminList(false);
                  setSelectedTenant(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tenantAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}