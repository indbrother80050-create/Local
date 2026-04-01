import { useAuthStore } from '../../store/auth.store';
import { useQuery } from '@tanstack/react-query';

export default function Profile() {
  const { user } = useAuthStore();

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await fetch('/api/v1/subscriptions/status');
      return res.json();
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Name</h3>
          <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Role</h3>
          <p className="mt-1">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
              {user?.role}
            </span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Subscription Status</h3>
          <p className="mt-1">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              subscription?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {subscription?.status || 'INACTIVE'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
