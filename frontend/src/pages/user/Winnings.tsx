import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Upload, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Winnings() {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { data: winnings = [], isLoading } = useQuery({
    queryKey: ['winnings'],
    queryFn: async () => {
      const res = await fetch('/api/v1/winners');
      if (!res.ok) throw new Error('Failed to fetch winnings');
      return res.json();
    },
  });

  const uploadProofMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch('/api/v1/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload image');
      const { url } = await uploadRes.json();

      const submitRes = await fetch(`/api/v1/winners/${id}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofUrl: url }),
      });

      if (!submitRes.ok) throw new Error('Failed to submit proof');
      return submitRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winnings'] });
      setUploadingId(null);
    },
    onError: () => {
      setUploadingId(null);
      alert('Failed to upload proof. Please try again.');
    }
  });

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingId(id);
      uploadProofMutation.mutate({ id, file });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Winnings</h1>
      
      {isLoading ? (
        <div className="text-center py-12">Loading winnings...</div>
      ) : !Array.isArray(winnings) || winnings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Winnings Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Keep logging your scores and participating in the monthly draws. Your time will come!
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          {Array.isArray(winnings) && winnings.map((winning: any) => (
            <div key={winning.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-xl gap-4">
              <div>
                <div className="font-semibold text-gray-900">
                  {new Date(winning.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Draw
                </div>
                <div className="text-sm text-gray-500">Status: {winning.status}</div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-xl font-bold text-emerald-600">${winning.prize}</div>
                
                {winning.status === 'PENDING' && (
                  <div className="relative">
                    <input 
                      type="file" 
                      id={`proof-${winning.id}`} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(winning.id, e)}
                      disabled={uploadingId === winning.id}
                    />
                    <label 
                      htmlFor={`proof-${winning.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                        uploadingId === winning.id 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {uploadingId === winning.id ? (
                        'Uploading...'
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Proof
                        </>
                      )}
                    </label>
                  </div>
                )}
                
                {winning.status === 'APPROVED' && (
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Approved
                  </div>
                )}
                
                {winning.status === 'PAID' && (
                  <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Paid
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
