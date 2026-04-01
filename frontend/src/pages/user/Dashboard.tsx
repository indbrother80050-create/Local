import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth.store';
import { useState } from 'react';
import { Trophy, Heart, CreditCard, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newScore, setNewScore] = useState('');

  const { data: scores = [] } = useQuery({
    queryKey: ['scores'],
    queryFn: async () => {
      const res = await fetch('/api/v1/scores');
      if (!res.ok) throw new Error('Failed to fetch scores');
      return res.json();
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await fetch('/api/v1/subscriptions/status');
      if (!res.ok) throw new Error('Failed to fetch subscription');
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

  const addScoreMutation = useMutation({
    mutationFn: async (value: number) => {
      const res = await fetch('/api/v1/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error('Failed to add score');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      setNewScore('');
    },
  });

  const selectCharityMutation = useMutation({
    mutationFn: async (charityId: string) => {
      const res = await fetch('/api/v1/charities/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId }),
      });
      if (!res.ok) throw new Error('Failed to select charity');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      window.location.reload(); // Quick refresh to update user state
    },
  });

  const handleSubscribe = async () => {
    const res = await fetch('/api/v1/subscriptions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'MONTHLY' }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <h2 className="text-xl font-semibold">Subscription</h2>
          </div>
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {subscription?.status || 'INACTIVE'}
            </span>
          </div>
          {subscription?.status !== 'ACTIVE' && (
            <button
              onClick={handleSubscribe}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Subscribe Now
            </button>
          )}
        </div>

        {/* Charity Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Heart size={20} />
            </div>
            <h2 className="text-xl font-semibold">Your Charity</h2>
          </div>
          <div className="space-y-4">
            <select
              value={user?.charityId || ''}
              onChange={(e) => selectCharityMutation.mutate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="" disabled>Select a charity</option>
              {Array.isArray(charities) && charities.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Contributing {user?.charityPercent || 10}% of your subscription.
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Trophy size={20} />
            </div>
            <h2 className="text-xl font-semibold">Latest Scores</h2>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (newScore) addScoreMutation.mutate(Number(newScore));
            }}
            className="flex gap-2 mb-6"
          >
            <input
              type="number"
              min="1"
              max="45"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              placeholder="Score (1-45)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={addScoreMutation.isPending}
              className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-3">
            {!Array.isArray(scores) || scores.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No scores yet.</p>
            ) : (
              scores.map((score: any) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">{score.value}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(score.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
