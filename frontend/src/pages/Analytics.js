import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI, projectsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchAnalytics(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchAnalytics = async (projectId) => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getByProject(projectId);
      const data = response.data;
      
      // Format subscriber growth data
      const formattedGrowth = data.subscriberGrowth.map(item => ({
        name: `${item._id.month}/${item._id.day}/${item._id.year}`,
        count: item.count
      }));
      
      // Format notification performance data
      const formattedPerformance = data.notificationPerformance.map(item => ({
        name: `${item._id.month}/${item._id.day}/${item._id.year}`,
        sent: item.sent || 0,
        delivered: item.delivered || 0,
        clicked: item.clicked || 0
      }));
      
      setAnalytics({
        ...data,
        subscriberGrowth: formattedGrowth,
        notificationPerformance: formattedPerformance
      });
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
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
          Analytics
        </motion.h1>
        {projects.length > 0 && (
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field w-auto"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {!analytics ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">Select a project to view analytics</p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card"
            >
              <p className="text-gray-400 text-sm mb-2">Total Sent</p>
              <p className="text-3xl font-bold gradient-text">
                {analytics.overview.totalSent.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card"
            >
              <p className="text-gray-400 text-sm mb-2">Total Delivered</p>
              <p className="text-3xl font-bold text-emerald-400">
                {analytics.overview.totalDelivered.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card"
            >
              <p className="text-gray-400 text-sm mb-2">Total Clicked</p>
              <p className="text-3xl font-bold text-royal-400">
                {analytics.overview.totalClicked.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card"
            >
              <p className="text-gray-400 text-sm mb-2">Click Rate</p>
              <p className="text-3xl font-bold text-purple-400">
                {analytics.overview.clickRate}%
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-200 mb-6">Notification Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.notificationPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#0056e6" name="Sent" />
                  <Line type="monotone" dataKey="delivered" stroke="#34A853" name="Delivered" />
                  <Line type="monotone" dataKey="clicked" stroke="#FBBC05" name="Clicked" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-200 mb-6">Subscriber Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.subscriberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0056e6" name="New Subscribers" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-200 mb-6">Recent Campaigns</h2>
            {analytics.recentNotifications.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No campaigns yet</p>
            ) : (
              <div className="space-y-4">
                {analytics.recentNotifications.map((notif, index) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-royal-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-200">{notif.title}</h3>
                        <p className="text-sm text-gray-400">{notif.message}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="text-gray-400">Sent: {notif.sent || 0}</span>
                          <span className="text-emerald-400">Delivered: {notif.delivered || 0}</span>
                          <span className="text-royal-400">Clicked: {notif.clicked || 0}</span>
                          {notif.delivered > 0 && (
                            <span className="text-purple-400 font-semibold">
                              CTR: {((notif.clicked / notif.delivered) * 100).toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Analytics;

