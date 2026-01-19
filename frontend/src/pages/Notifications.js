import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI, projectsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  
  const [notifications, setNotifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    icon: '',
    image: '',
    url: '',
    type: 'instant',
    scheduledFor: '',
    targetAudience: {
      browsers: [],
      countries: [],
      tags: []
    }
  });

  useEffect(() => {
    fetchProjects();
    if (projectId) {
      fetchNotifications(projectId);
    } else {
      fetchAllNotifications();
    }
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      if (response.data.length > 0 && !selectedProject) {
        setSelectedProject(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const fetchNotifications = async (pid) => {
    try {
      const response = await notificationsAPI.getByProject(pid);
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const allProjects = await projectsAPI.getAll();
      const allNotifs = [];
      for (const project of allProjects.data) {
        try {
          const res = await notificationsAPI.getByProject(project._id);
          allNotifs.push(...res.data.map(n => ({ ...n, projectName: project.name })));
        } catch (e) {
          console.error(e);
        }
      }
      setNotifications(allNotifs);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      toast.error('Please select a project');
      return;
    }

    try {
      const data = {
        ...formData,
        projectId: selectedProject,
        scheduledFor: formData.type === 'scheduled' && formData.scheduledFor 
          ? new Date(formData.scheduledFor).toISOString() 
          : undefined
      };
      
      await notificationsAPI.create(data);
      toast.success('Notification created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        icon: '',
        image: '',
        url: '',
        type: 'instant',
        scheduledFor: '',
        targetAudience: { browsers: [], countries: [], tags: [] }
      });
      
      if (projectId || selectedProject) {
        fetchNotifications(projectId || selectedProject);
      } else {
        fetchAllNotifications();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create notification');
    }
  };

  const handleSend = async (id) => {
    try {
      await notificationsAPI.send(id);
      toast.success('Notification sent successfully!');
      if (projectId || selectedProject) {
        fetchNotifications(projectId || selectedProject);
      } else {
        fetchAllNotifications();
      }
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationsAPI.delete(id);
        toast.success('Notification deleted successfully!');
        if (projectId || selectedProject) {
          fetchNotifications(projectId || selectedProject);
        } else {
          fetchAllNotifications();
        }
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

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
          Notifications
        </motion.h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Create Notification
          </button>
        </motion.div>
      </div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🔔
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No notifications yet</h3>
          <p className="text-gray-400 mb-6">Create your first notification campaign</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Notification
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2 }
              }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-200">{notif.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      notif.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      notif.status === 'scheduled' ? 'bg-royal-500/20 text-royal-400 border border-royal-500/30' :
                      notif.status === 'sending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {notif.status}
                    </span>
                    {notif.projectName && (
                      <span className="text-sm text-gray-400">• {notif.projectName}</span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4">{notif.message}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                    <span>📤 Sent: {notif.sent || 0}</span>
                    <span>✅ Delivered: {notif.delivered || 0}</span>
                    <span>👆 Clicked: {notif.clicked || 0}</span>
                    <span>❌ Failed: {notif.failed || 0}</span>
                    {notif.sent > 0 && (
                      <span className="text-royal-400 font-semibold">
                        CTR: {((notif.clicked / notif.delivered) * 100).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {notif.status !== 'sent' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(notif._id)}
                      className="px-4 py-2 bg-gradient-to-r from-royal-600 to-royal-700 text-white rounded-lg hover:from-royal-500 hover:to-royal-600 transition-all text-sm shadow-lg shadow-royal-500/30"
                    >
                      Send
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(notif._id)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-all text-sm"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Notification Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl shadow-2xl p-6 max-w-2xl w-full my-8 border border-dark-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-200 mb-6">Create Notification</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    required
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Notification message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Action URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="instant">Instant</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {formData.type === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;

