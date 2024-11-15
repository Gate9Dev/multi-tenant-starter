import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { TenantDashboard } from './components/TenantDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuthStore } from './store/authStore';
import { setupDb } from './lib/db';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    setupDb().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && user ? (
        user.role === 'siteAdmin' ? (
          <AdminDashboard />
        ) : (
          <TenantDashboard tenant={user.tenant} />
        )
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Multi-Tenant App</h1>
            <p className="text-lg text-gray-600">Please login to access your dashboard</p>
          </div>
          <LoginForm />
        </div>
      )}
    </div>
  );
}

export default App;