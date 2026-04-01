import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Subscribe() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: 'MONTHLY' | 'YEARLY') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/v1/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error('Failed to start checkout');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to start checkout', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">
          Join the community, track your scores, and support great causes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Monthly Plan */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold">$10</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {['Track up to 5 latest scores', 'Entry into monthly draws', 'Minimum 10% to charity', 'Cancel anytime'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <Check className="text-emerald-500" size={20} />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('MONTHLY')}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Subscribe Monthly
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
            SAVE 20%
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold text-white">$96</span>
            <span className="text-gray-400">/year</span>
          </div>
          <ul className="space-y-4 mb-8">
            {['Track up to 5 latest scores', 'Entry into monthly draws', 'Minimum 10% to charity', '2 months free'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <Check className="text-emerald-400" size={20} />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe('YEARLY')}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            Subscribe Yearly
          </button>
        </div>
      </div>
    </div>
  );
}
