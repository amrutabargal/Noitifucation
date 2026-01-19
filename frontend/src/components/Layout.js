import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass shadow-2xl border-b border-dark-700/50 sticky top-0 z-50 w-full backdrop-blur-xl"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-royal-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-br from-royal-500 via-royal-600 to-royal-700 rounded-xl flex items-center justify-center shadow-lg shadow-royal-500/50 animate-glow-pulse"
              >
                <span className="text-white text-xl font-bold">P</span>
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold gradient-text hidden sm:block"
              >
                PushNotify
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-3"
            >
              {user?.picture && (
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-royal-500/50 shadow-lg shadow-royal-500/30"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-200">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-royal-400 transition-colors rounded-lg hover:bg-dark-800/50"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="flex w-full">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-64 glass shadow-2xl border-r border-dark-700/50 min-h-screen fixed lg:fixed lg:translate-x-0 z-40 backdrop-blur-xl"
              style={{ top: '73px', height: 'calc(100vh - 73px)' }}
            >
              <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg shadow-royal-500/50 transform scale-105'
                          : 'text-gray-400 hover:bg-dark-800/50 hover:text-royal-400'
                      }`}
                    >
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-royal-600 to-royal-700 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="text-xl relative z-10 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-medium relative z-10">{item.label}</span>
                      {isActive(item.path) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main 
          className="flex-1 p-6 w-full min-h-screen" 
          style={{ 
            marginLeft: isDesktop ? '16rem' : '0',
            width: isDesktop ? 'calc(100% - 16rem)' : '100%',
            transition: 'margin-left 0.3s ease'
          }}
        >
          <div className="w-full max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;

