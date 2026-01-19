import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const { login: googleLogin, user, loginWithEmail, registerWithEmail } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

  const handleGoogleLogin = () => {
    try {
      googleLogin();
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        // Check if user doesn't exist, show register option
        const errorMsg = result.error?.toLowerCase() || '';
        if (errorMsg.includes('not found') || 
            errorMsg.includes('does not exist') ||
            errorMsg.includes('user not found') ||
            errorMsg.includes('invalid email') ||
            errorMsg.includes('no account')) {
          toast.error('Account not found. Please create an account.');
          setShowRegister(true);
          setShowEmailForm(false);
          // Keep email in form for registration
        } else {
          toast.error(result.error || 'Login failed');
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setShowRegister(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        toast.error(result.error || 'Registration failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Registration failed');
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

      {/* Animated Bubbles - Floating Up */}
      {[...Array(25)].map((_, i) => {
        const size = Math.random() * 80 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 12;
        const xOffset = (Math.random() - 0.5) * 150;
        
        return (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full border-2 border-royal-400/40 bg-gradient-to-br from-royal-500/20 to-royal-600/10 backdrop-blur-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: '-60px'
            }}
            animate={{
              y: [0, -1200],
              x: [0, xOffset],
              scale: [0.8, 1.3, 1, 0.6],
              opacity: [0.4, 0.7, 0.5, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
          />
        );
      })}

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Animated Theme Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center p-8 relative"
        >
          {/* Multiple Animated Planes */}
          <motion.div
            animate={{
              x: [0, 150, 0],
              y: [0, -80, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 z-20"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="text-royal-400 drop-shadow-2xl filter drop-shadow-[0_0_10px_rgba(0,86,230,0.5)]"
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </motion.div>

          {/* Second Plane */}
          <motion.div
            animate={{
              x: [-50, 200, -50],
              y: [100, -30, 100],
              rotate: [0, -20, 20, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-40 right-20 z-20"
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              className="text-royal-300 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(0,86,230,0.4)]"
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
          </motion.div>

          {/* Third Small Plane */}
          <motion.div
            animate={{
              x: [50, 250, 50],
              y: [200, 50, 200],
              rotate: [0, 25, -25, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute bottom-20 left-20 z-20"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              className="text-royal-500 drop-shadow-lg filter drop-shadow-[0_0_6px_rgba(0,86,230,0.3)]"
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="currentColor"
                opacity="0.7"
              />
            </svg>
          </motion.div>

          {/* Floating Particles/Stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [-20, -150],
                x: [0, (Math.random() - 0.5) * 200],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 bg-royal-400 rounded-full blur-sm"
              style={{
                left: `${10 + (i % 6) * 15}%`,
                top: `${20 + Math.floor(i / 6) * 30}%`
              }}
            />
          ))}

          {/* Notification Icons Floating */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`notif-${i}`}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 360]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut"
              }}
              className="absolute text-royal-400/30"
              style={{
                left: `${15 + i * 20}%`,
                top: `${40 + i * 15}%`,
                fontSize: `${20 + i * 5}px`
              }}
            >
              🔔
            </motion.div>
          ))}

          {/* Decorative Bubbles in Side Theme */}
          {[...Array(18)].map((_, i) => {
            const size = Math.random() * 50 + 15;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 4;
            const duration = Math.random() * 10 + 8;
            
            return (
              <motion.div
                key={`theme-bubble-${i}`}
                className="absolute rounded-full border border-royal-400/25 bg-gradient-to-br from-royal-500/15 to-royal-600/5 backdrop-blur-sm"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, (Math.random() - 0.5) * 60],
                  scale: [1, 1.4, 0.8, 1],
                  opacity: [0.2, 0.6, 0.4, 0.2]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Main Content */}
          <div className="text-center space-y-6 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block p-6 bg-gradient-to-br from-royal-500/20 to-royal-600/20 rounded-3xl backdrop-blur-md border border-royal-500/30 mb-6"
            >
              <svg
                className="w-24 h-24 text-royal-400"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-bold gradient-text mb-4"
            >
              PushNotify
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-2"
            >
              Premium Web Push Notification Platform
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-sm max-w-md mx-auto"
            >
              Engage your audience with powerful push notifications. Send instant updates, drive traffic, and boost conversions.
            </motion.p>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 mt-8 text-left max-w-sm mx-auto"
            >
              {[
                { icon: '✓', text: 'Real-time notifications' },
                { icon: '✓', text: 'Advanced analytics' },
                { icon: '✓', text: 'Easy integration' },
                { icon: '✓', text: 'Secure & reliable' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <span className="text-royal-400 text-xl font-bold">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Animated Circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 right-10 w-32 h-32 border-2 border-royal-500/20 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-10 left-10 w-24 h-24 border-2 border-royal-400/20 rounded-full"
            />
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="glass rounded-3xl shadow-2xl p-8 md:p-12 w-full relative z-10 border border-dark-700/50"
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

        {/* Direct Google Login Button */}
        <AnimatePresence mode="wait">
          {!showEmailForm && !showRegister ? (
            <motion.div
              key="google"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">OR</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmailForm(true)}
                className="w-full btn-secondary"
              >
                Continue with Email
              </motion.button>
            </motion.div>
          ) : showRegister ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-200">Create Account</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowRegister(false);
                    setShowEmailForm(true);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Back to Login
                </motion.button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
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
                      Creating Account...
                    </span>
                  ) : 'Create Account'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="email-login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-200">Login with Email</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowEmailForm(false);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Back
                </motion.button>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  />
                </div>

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
                      Logging in...
                    </span>
                  ) : 'Login'}
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
      </div>

      {/* Mobile View - Simplified Theme */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:hidden absolute top-10 left-0 right-0 text-center z-10"
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
          className="inline-block p-4 bg-gradient-to-br from-royal-500/20 to-royal-600/20 rounded-2xl backdrop-blur-sm border border-royal-500/30 mb-4"
        >
          <svg
            className="w-16 h-16 text-royal-400 mx-auto"
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
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold gradient-text mb-2"
        >
          PushNotify
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm"
        >
          Premium Web Push Notification Platform
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
