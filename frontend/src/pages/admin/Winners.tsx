import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, CheckCircle, ExternalLink } from 'lucide-react';

export default function Winners() {
  const queryClient = useQueryClient();

  const { data: winners = [], isLoading } = useQuery({
    queryKey: ['admin-winners'],
    queryFn: async () => {
      const res = await fetch('/api/v1/winners/all');
      if (!res.ok) throw new Error('Failed to fetch winners');
      return res.json();
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/winners/${id}/pay`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to mark as paid');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-winners'] });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Winners Management</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading winners...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Prize</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Proof</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(winners) && winners.map((winner: any) => (
                <tr key={winner.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-900">
                    {new Date(winner.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{winner.user.name}</div>
                    <div className="text-sm text-gray-500">{winner.user.email}</div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">
                    ${winner.prize}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      winner.status === 'PAID' ? 'bg-indigo-100 text-indigo-700' :
                      winner.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {winner.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {winner.proofUrl ? (
                      <a href={winner.proofUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm">
                        View <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {winner.status === 'APPROVED' && (
                      <button 
                        onClick={() => markPaidMutation.mutate(winner.id)}
                        disabled={markPaidMutation.isPending}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {winners.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No winners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
