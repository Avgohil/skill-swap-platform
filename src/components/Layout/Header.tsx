import React from 'react';
import { motion } from 'framer-motion';
import { User, Search, Bell, Settings, LogOut, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user, isAuthenticated } = state;

  const handleViewChange = (view: string) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'browse', label: 'Browse Skills', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'swaps', label: 'My Swaps', icon: Bell },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleViewChange('home')}
          >
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SkillSwap
            </span>
          </motion.div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    state.currentView === item.id
                      ? 'bg-white/20 text-purple-600'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-white/10'
                  }`}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange('settings')}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Settings size={20} className="text-gray-600" />
                </motion.button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange('login')}
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChange('register')}
                  className="px-4 py-2 gradient-primary text-white rounded-lg font-medium shadow-lg"
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;