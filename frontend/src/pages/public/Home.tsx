import { Link } from 'react-router-dom';
import { Trophy, Heart, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Play Golf. Win Prizes. <span className="text-emerald-600">Help Others.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Join our monthly subscription platform. Track your latest 5 scores, enter into our monthly draw, and contribute to charities you care about.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Start Your Journey
          </Link>
          <Link
            to="/login"
            className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            Member Login
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <Trophy size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Track Scores</h3>
          <p className="text-gray-500">
            Log your golf scores (1-45). We keep your latest 5 scores to calculate your chances in our monthly algorithm-based draws.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Monthly Draws</h3>
          <p className="text-gray-500">
            Every month, active subscribers are entered into a draw. Match 3, 4, or 5 numbers to win a portion of the prize pool!
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Support Charity</h3>
          <p className="text-gray-500">
            A minimum of 10% of your subscription goes to a charity of your choice. You can increase this percentage anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
