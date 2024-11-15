import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, Building2, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { TenantAdminView } from './TenantAdminView';

interface TenantDashboardProps {
  tenant: string;
}

export function TenantDashboard({ tenant }: TenantDashboardProps) {
  const { user, logout } = useAuthStore();
  const isTenantAdmin = user?.role === 'tenantAdmin';
  const [showAdminView, setShowAdminView] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">{tenant}</span>
              {isTenantAdmin && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Tenant Admin</span>}
            </div>
            <div className="flex items-center gap-4">
              {isTenantAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant={!showAdminView ? "primary" : "secondary"}
                    icon={LayoutDashboard}
                    onClick={() => setShowAdminView(false)}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={showAdminView ? "primary" : "secondary"}
                    icon={Settings}
                    onClick={() => setShowAdminView(true)}
                  >
                    Admin
                  </Button>
                </div>
              )}
              <span className="text-gray-700">{user.email}</span>
              <Button onClick={logout} icon={LogOut} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isTenantAdmin && showAdminView ? (
            <TenantAdminView tenant={tenant} tenantId={user.tenant_id} />
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to {tenant}</h2>
              <p className="text-gray-600">
                This is your tenant dashboard. Access your organization's resources and data here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}