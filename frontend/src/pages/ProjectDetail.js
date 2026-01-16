import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, subscribersAPI, notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, subscribersRes, notificationsRes, statsRes] = await Promise.all([
        projectsAPI.getById(id),
        subscribersAPI.getByProject(id),
        notificationsAPI.getByProject(id),
        subscribersAPI.getStats(id)
      ]);

      setProject(projectRes.data);
      setSubscribers(subscribersRes.data);
      setNotifications(notificationsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-royal-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/projects" className="text-royal-600 hover:text-royal-700 mb-2 inline-block">
            ← Back to Projects
          </Link>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            {project.name}
          </motion.h1>
          <p className="text-gray-600 mt-1">{project.domain}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'subscribers', 'notifications', 'integration'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-royal-600 text-royal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Total Subscribers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Inactive</p>
                <p className="text-3xl font-bold text-gray-400">{stats.inactive}</p>
              </div>
              <div className="card">
                <p className="text-gray-600 text-sm mb-2">Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
              <Link to={`/notifications?project=${id}`} className="text-royal-600 hover:text-royal-700 font-medium">
                View All →
              </Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notif) => (
                  <div key={notif._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        notif.status === 'sent' ? 'bg-green-100 text-green-700' :
                        notif.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'subscribers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Subscribers ({subscribers.length})</h2>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No subscribers yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Browser</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">OS</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{sub.browser || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{sub.os || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{sub.country || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={`/notifications?project=${id}`} className="btn-primary inline-block mb-6">
            + Create Notification
          </Link>
          <div className="card">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Sent: {notif.sent || 0}</span>
                          <span>Delivered: {notif.delivered || 0}</span>
                          <span>Clicked: {notif.clicked || 0}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        notif.status === 'sent' ? 'bg-green-100 text-green-700' :
                        notif.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'integration' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Integration Code</h2>
            <p className="text-gray-600 mb-6">
              Add this code to your website to enable push notifications
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAPID Public Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={project.vapidPublicKey}
                    className="input-field flex-1 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(project.vapidPublicKey, 'vapid')}
                    className="p-2 bg-royal-600 text-white rounded-lg hover:bg-royal-700 transition-colors"
                    title="Copy"
                  >
                    {copied === 'vapid' ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={project.apiKey}
                    className="input-field flex-1 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(project.apiKey, 'api')}
                    className="p-2 bg-royal-600 text-white rounded-lg hover:bg-royal-700 transition-colors"
                    title="Copy"
                  >
                    {copied === 'api' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">JavaScript SDK</h3>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`<script src="https://cdn.jsdelivr.net/npm/web-push-sdk@latest"></script>
<script>
  PushNotify.init({
    projectId: '${id}',
    vapidPublicKey: '${project.vapidPublicKey}',
    apiKey: '${project.apiKey}',
    apiUrl: '${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}'
  });
</script>`}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetail;

