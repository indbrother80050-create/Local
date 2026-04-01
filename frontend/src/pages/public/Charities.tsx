import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';

export default function Charities() {
  const { data: charities = [], isLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: async () => {
      const res = await fetch('/api/v1/charities');
      if (!res.ok) throw new Error('Failed to fetch charities');
      return res.json();
    },
  });

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partner Charities</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We believe in giving back. A portion of every subscription goes directly to these amazing organizations.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading charities...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(charities) && charities.map((charity: any) => (
            <div key={charity.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{charity.name}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{charity.description}</p>
              {charity.website && (
                <a
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-medium hover:underline mt-auto"
                >
                  Visit Website &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
