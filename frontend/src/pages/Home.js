import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 text-gray-100 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-royal-500 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-royal-700 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Floating orbs */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-royal-500/10 border border-royal-400/30 backdrop-blur-sm"
          style={{
            width: `${20 + (i % 4) * 10}px`,
            height: `${20 + (i % 4) * 10}px`,
            top: `${10 + i * 7}%`,
            left: `${5 + (i * 11) % 90}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10 sm:mb-14">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-royal-500 via-royal-600 to-royal-700 rounded-xl flex items-center justify-center shadow-lg shadow-royal-500/50"
            >
              <span className="text-white text-xl font-bold">P</span>
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-lg font-bold gradient-text">PushNotify</p>
              <p className="text-xs text-gray-400">Premium Web Push Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-300 hover:text-royal-300 rounded-lg border border-dark-600 hover:border-royal-500 transition-all"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white shadow-lg shadow-royal-500/40 transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Hero section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
            >
              <span className="gradient-text">Turn visitors into loyal customers</span>
              <br />
              with real‑time push notifications.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-300 text-sm sm:text-base max-w-xl"
            >
              PushNotify helps you send beautiful, targeted web push campaigns that bring users back,
              boost engagement, and grow your revenue — all in a few clicks.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-royal-600 to-royal-500 hover:from-royal-500 hover:to-royal-400 text-white font-semibold shadow-lg shadow-royal-500/40 transition-all hover:scale-105"
              >
                Start Free
                <span className="ml-2 text-lg">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-dark-600 hover:border-royal-500 bg-dark-900/40 text-gray-300 hover:text-royal-200 font-medium transition-all"
              >
                View Features
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 max-w-md pt-4 border-t border-dark-700/70 mt-4"
            >
              <div>
                <p className="text-lg sm:text-xl font-bold text-royal-300">10k+</p>
                <p className="text-xs text-gray-400">Subscribers managed</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-emerald-300">35%</p>
                <p className="text-xs text-gray-400">Average CTR</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-purple-300">99.9%</p>
                <p className="text-xs text-gray-400">Delivery rate</p>
              </div>
            </motion.div>
          </div>

          {/* Right - preview card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-3xl border border-dark-700/60 shadow-2xl p-6 sm:p-8">
              <p className="text-xs text-royal-300 font-semibold mb-2">LIVE PREVIEW</p>
              <p className="text-sm text-gray-400 mb-4">
                This is how your users will see your push campaigns.
              </p>

              {/* Notification preview */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-dark-800/80 border border-dark-600 rounded-2xl p-4 flex gap-3 items-start shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center text-xl">
                    🔔
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-100">Flash Sale is Live!</p>
                    <p className="text-xs text-gray-400 mt-1">
                      40% off on your favourite products for the next 2 hours. Don&apos;t miss out.
                    </p>
                    <button className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg bg-royal-600 text-xs font-semibold text-white hover:bg-royal-500 transition-colors">
                      View Offer
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-3 gap-3 mt-4"
                >
                  <div className="bg-dark-800/70 rounded-xl p-3 border border-dark-600">
                    <p className="text-xs text-gray-400">Campaigns</p>
                    <p className="mt-1 text-lg font-bold text-gray-100">124</p>
                  </div>
                  <div className="bg-dark-800/70 rounded-xl p-3 border border-dark-600">
                    <p className="text-xs text-gray-400">Subscribers</p>
                    <p className="mt-1 text-lg font-bold text-gray-100">8,532</p>
                  </div>
                  <div className="bg-dark-800/70 rounded-xl p-3 border border-dark-600">
                    <p className="text-xs text-gray-400">CTR</p>
                    <p className="mt-1 text-lg font-bold text-emerald-300">32%</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features section */}
        <div id="features" className="mt-16 sm:mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-gray-100 mb-6"
          >
            Why teams choose <span className="gradient-text">PushNotify</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Easy Integration',
                desc: 'Drop-in script and start sending push notifications in minutes, not days.',
                icon: '⚡',
              },
              {
                title: 'Powerful Analytics',
                desc: 'Track deliveries, clicks, CTR, and growth from a beautiful real-time dashboard.',
                icon: '📊',
              },
              {
                title: 'Automation Ready',
                desc: 'Set up recurring campaigns and behavior-based triggers with ease.',
                icon: '🤖',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="card border border-dark-700/60 bg-gradient-to-br from-dark-900/80 to-dark-800/80"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;


