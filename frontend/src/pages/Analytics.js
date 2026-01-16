import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI, projectsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

  const COLORS = ['#0056e6', '#34A853', '#FBBC05', '#EA4335', '#9C27B0'];

  if (loading && !analytics) {
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
          <p className="text-gray-500">Select a project to view analytics</p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <p className="text-gray-600 text-sm mb-2">Total Sent</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.overview.totalSent.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <p className="text-gray-600 text-sm mb-2">Total Delivered</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.overview.totalDelivered.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <p className="text-gray-600 text-sm mb-2">Total Clicked</p>
              <p className="text-3xl font-bold text-royal-600">
                {analytics.overview.totalClicked.toLocaleString()}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <p className="text-gray-600 text-sm mb-2">Click Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.overview.clickRate}%
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Performance</h2>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subscriber Growth</h2>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Campaigns</h2>
            {analytics.recentNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No campaigns yet</p>
            ) : (
              <div className="space-y-4">
                {analytics.recentNotifications.map((notif) => (
                  <div key={notif._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">Sent: {notif.sent || 0}</span>
                          <span className="text-green-600">Delivered: {notif.delivered || 0}</span>
                          <span className="text-royal-600">Clicked: {notif.clicked || 0}</span>
                          {notif.delivered > 0 && (
                            <span className="text-purple-600 font-semibold">
                              CTR: {((notif.clicked / notif.delivered) * 100).toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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

