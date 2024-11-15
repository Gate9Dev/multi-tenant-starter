import { useAuthStore } from '../store/authStore';
import { TenantDashboard } from '../components/TenantDashboard';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && <TenantDashboard tenant={user.tenant} />}
        </div>
      </main>
    </div>
  );
}