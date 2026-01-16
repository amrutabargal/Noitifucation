import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, analyticsAPI } from '../services/api';
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
      color: 'from-blue-500 to-blue-600',
      link: '/projects'
    },
    {
      title: 'Total Subscribers',
      value: stats.totalSubscribers.toLocaleString(),
      icon: '👥',
      color: 'from-green-500 to-green-600',
      link: '/projects'
    },
    {
      title: 'Notifications Sent',
      value: stats.totalSent.toLocaleString(),
      icon: '📨',
      color: 'from-purple-500 to-purple-600',
      link: '/notifications'
    },
    {
      title: 'Total Campaigns',
      value: stats.totalNotifications,
      icon: '📊',
      color: 'from-royal-500 to-royal-600',
      link: '/notifications'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-royal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Dashboard
        </motion.h1>
        <Link to="/projects" className="btn-primary">
          + New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105"
          >
            <Link to={stat.link} className="block">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
          <Link to="/projects" className="text-royal-600 hover:text-royal-700 font-medium">
            View All →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link to="/projects/new" className="btn-primary inline-block">
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Link to={`/projects/${project._id}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.domain}</p>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {project.subscribers?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Subscribers</p>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-royal-600 hover:text-royal-700"
                  >
                    →
                  </Link>
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

