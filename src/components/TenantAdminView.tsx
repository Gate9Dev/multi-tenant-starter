import React, { useState, useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';
import { getTenantUsers } from '../lib/db';
import { AddUserModal } from './AddUserModal';

interface TenantAdminViewProps {
  tenant: string;
  tenantId: number;
}

interface User {
  email: string;
  role: string;
  created_at: string;
}

export function TenantAdminView({ tenant, tenantId }: TenantAdminViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const tenantUsers = await getTenantUsers(tenantId);
      setUsers(tenantUsers as User[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [tenantId]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Tenant Administration</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your organization's users and settings</p>
          </div>
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            icon={UserPlus}
          >
            Add User
          </Button>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Users</h3>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">
              {error}
              <Button
                onClick={loadUsers}
                variant="secondary"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        tenant={{ id: tenantId, tenant }}
        onUserAdded={loadUsers}
      />
    </div>
  );
}