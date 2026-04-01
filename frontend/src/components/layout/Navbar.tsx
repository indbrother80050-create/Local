import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-emerald-600">GolfCharity</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/charities" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
              Charities
            </Link>
            <Link to="/subscribe" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/winnings" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                  Winnings
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                      Admin
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                      Users
                    </Link>
                    <Link to="/admin/winners" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                      Winners
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-gray-200">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <User size={16} /> {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/charities" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Charities
            </Link>
            <Link to="/subscribe" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Pricing
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/winnings" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Winnings
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <>
                    <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                      Admin
                    </Link>
                    <Link to="/admin/users" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                      Users
                    </Link>
                    <Link to="/admin/winners" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                      Winners
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Log in
                </Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-emerald-600 hover:text-emerald-800 hover:bg-gray-50">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
