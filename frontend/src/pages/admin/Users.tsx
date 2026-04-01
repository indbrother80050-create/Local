import { useQuery } from '@tanstack/react-query';

export default function Users() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found or endpoint not implemented.</p>
        ) : (
          <div className="space-y-4">
            {/* User list would go here */}
          </div>
        )}
      </div>
    </div>
  );
}
