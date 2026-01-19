import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSubscribers: 0,
    totalNotifications: 0,
    totalSent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes] = await Promise.all([
        projectsAPI.getAll()
      ]);

      const projectsData = projectsRes.data;
      setProjects(projectsData);

      // Calculate stats
      const totalSubscribers = projectsData.reduce((sum, p) => sum + (p.subscribers?.length || 0), 0);
      const totalNotifications = projectsData.reduce((sum, p) => sum + (p.notifications?.length || 0), 0);

      setStats({
        totalProjects: projectsData.length,
        totalSubscribers,
        totalNotifications,
        totalSent: 0 // Would need to fetch from analytics
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: '📁',
      color: 'from-royal-500 to-royal-600',
      glow: 'shadow-royal-500/30',
      link: '/projects'
    },
    {
      title: 'Total Subscribers',
      value: stats.totalSubscribers.toLocaleString(),
      icon: '👥',
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/30',
      link: '/projects'
    },
    {
      title: 'Notifications Sent',
      value: stats.totalSent.toLocaleString(),
      icon: '📨',
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/30',
      link: '/notifications'
    },
    {
      title: 'Total Campaigns',
      value: stats.totalNotifications,
      icon: '📊',
      color: 'from-royal-400 to-royal-500',
      glow: 'shadow-royal-400/30',
      link: '/notifications'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-dark-700 border-t-royal-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold gradient-text"
        >
          Dashboard
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/projects" className="btn-primary">
            + New Project
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="card group cursor-pointer relative overflow-hidden"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <Link to={stat.link} className="block relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg ${stat.glow} animate-glow-pulse`}
                >
                  {stat.icon}
                </motion.div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2 group-hover:text-gray-300 transition-colors">{stat.title}</h3>
              <motion.p 
                className="text-4xl font-bold gradient-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {stat.value}
              </motion.p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-200">Recent Projects</h2>
          <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/projects" className="text-royal-400 hover:text-royal-300 font-medium flex items-center gap-2 transition-colors">
              View All <span>→</span>
            </Link>
          </motion.div>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📁
            </motion.div>
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Link to="/projects/new" className="btn-primary inline-block">
              Create Your First Project
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 border border-dark-700/50 hover:border-royal-500/30 transition-all group"
              >
                <Link to={`/projects/${project._id}`} className="flex-1">
                  <h3 className="font-semibold text-gray-200 group-hover:text-royal-400 transition-colors">{project.name}</h3>
                  <p className="text-sm text-gray-400">{project.domain}</p>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-200">
                      {project.subscribers?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Subscribers</p>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-royal-400 hover:text-royal-300 text-xl font-bold"
                    >
                      →
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;

