import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [newCharity, setNewCharity] = useState({ name: '', description: '' });

  const { data: draws = [] } = useQuery({
    queryKey: ['draws'],
    queryFn: async () => {
      const res = await fetch('/api/v1/draws');
      if (!res.ok) throw new Error('Failed to fetch draws');
      return res.json();
    },
  });

  const { data: charities = [] } = useQuery({
    queryKey: ['charities'],
    queryFn: async () => {
      const res = await fetch('/api/v1/charities');
      if (!res.ok) throw new Error('Failed to fetch charities');
      return res.json();
    },
  });

  const runDrawMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v1/draws/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'RANDOM' }),
      });
      if (!res.ok) throw new Error('Failed to run draw');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });

  const addCharityMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/v1/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add charity');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      setNewCharity({ name: '', description: '' });
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Draw Management */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Draw Management</h2>
            <button
              onClick={() => runDrawMutation.mutate()}
              disabled={runDrawMutation.isPending}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {runDrawMutation.isPending ? 'Running...' : 'Run Monthly Draw'}
            </button>
          </div>

          <div className="space-y-4">
            {Array.isArray(draws) && draws.map((draw: any) => (
              <div key={draw.id} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{new Date(draw.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${draw.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {draw.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Pool: ${draw.totalPool} | Winners: {draw.results?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charity Management */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Charities</h2>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              addCharityMutation.mutate(newCharity);
            }}
            className="mb-6 space-y-4 bg-gray-50 p-4 rounded-xl"
          >
            <input
              type="text"
              placeholder="Charity Name"
              value={newCharity.name}
              onChange={(e) => setNewCharity({ ...newCharity, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <textarea
              placeholder="Description"
              value={newCharity.description}
              onChange={(e) => setNewCharity({ ...newCharity, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={addCharityMutation.isPending}
              className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Add Charity
            </button>
          </form>

          <div className="space-y-3">
            {Array.isArray(charities) && charities.map((charity: any) => (
              <div key={charity.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="font-semibold">{charity.name}</div>
                <div className="text-sm text-gray-500 truncate">{charity.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
