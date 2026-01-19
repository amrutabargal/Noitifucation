import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'viewer'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold gradient-text"
      >
        Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-200 mb-6">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input-field bg-dark-900/50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  disabled
                  className="input-field bg-dark-900/50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </form>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-200 mb-6">Account Information</h2>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-300">Member Since</p>
                  <p className="text-sm text-gray-400">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-300">Last Login</p>
                  <p className="text-sm text-gray-400">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-200 mb-6">Profile Picture</h2>
          <div className="flex flex-col items-center">
            {user?.picture ? (
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={user.picture}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-royal-500/50 mb-4 shadow-lg shadow-royal-500/30"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-royal-500/30"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
            )}
            <p className="text-sm text-gray-400 text-center">
              Profile picture is managed by Google
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

