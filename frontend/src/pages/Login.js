import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const { login: googleLogin, user, loginWithEmail, registerWithEmail, fetchUser } = useAuth();
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // Register validation
        if (!formData.name.trim()) {
          toast.error('Please enter your full name');
          setLoading(false);
          return;
        }

        if (formData.name.trim().length < 2) {
          toast.error('Name must be at least 2 characters');
          setLoading(false);
          return;
        }

        if (!formData.email.trim()) {
          toast.error('Please enter your email');
          setLoading(false);
          return;
        }

        if (!validateEmail(formData.email.trim())) {
          toast.error('Please enter a valid email address');
          setLoading(false);
          return;
        }

        if (!formData.password) {
          toast.error('Please enter a password');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await registerWithEmail(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );

        if (result.success) {
          toast.success('Registration successful! Welcome!');
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          setIsRegister(false);
          // Small delay to show success message, then redirect
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          toast.error(result.error || 'Registration failed');
          setLoading(false);
        }
      } else {
        // Login validation
        if (!formData.email.trim()) {
          toast.error('Please enter your email');
          setLoading(false);
          return;
        }

        if (!validateEmail(formData.email.trim())) {
          toast.error('Please enter a valid email address');
          setLoading(false);
          return;
        }

        if (!formData.password) {
          toast.error('Please enter your password');
          setLoading(false);
          return;
        }

        const result = await loginWithEmail(
          formData.email.trim(),
          formData.password
        );

        if (result.success) {
          toast.success('Login successful! Welcome back!');
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          // Small delay to show success message, then redirect
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          toast.error(result.error || 'Login failed');
          setLoading(false);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-royal-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-royal-600 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="glass rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative z-10 border border-dark-700/50"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block p-4 bg-gradient-to-br from-royal-500/20 to-royal-600/20 rounded-2xl mb-4 backdrop-blur-sm border border-royal-500/30"
          >
            <svg
              className="w-16 h-16 text-royal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold gradient-text mb-2"
          >
            PushNotify
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            Premium Web Push Notification Platform
          </motion.p>
        </motion.div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6 bg-dark-800/50 p-1 rounded-xl border border-dark-700/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEmailLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              !isEmailLogin
                ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg shadow-royal-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Google Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEmailLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              isEmailLogin
                ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg shadow-royal-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Email Login
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {!isEmailLogin ? (
            <motion.div
              key="google"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                  // Check if Google OAuth is configured
                  fetch(`${API_URL}/auth/google`, { method: 'HEAD' })
                    .then(() => {
                      googleLogin();
                    })
                    .catch(() => {
                      toast.error('Google OAuth is not configured. Please use Email Login or configure Google OAuth in backend/.env');
                    });
                }}
                className="w-full bg-dark-800/50 border-2 border-dark-700 text-gray-200 font-semibold py-4 px-6 rounded-xl hover:bg-dark-800 hover:border-royal-500/50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-2 mb-4 bg-dark-800/50 p-1 rounded-xl border border-dark-700/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    !isRegister
                      ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg shadow-royal-500/30'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    isRegister
                      ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white shadow-lg shadow-royal-500/30'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Register
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full btn-primary"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Please wait...
                    </span>
                  ) : isRegister ? 'Create Account' : 'Login'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm z-10"
      >
        <p>© 2024 PushNotify. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default Login;
