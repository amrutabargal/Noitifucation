import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    platform: 'website'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      toast.success('Project created successfully!');
      setShowModal(false);
      setFormData({ name: '', domain: '', platform: 'website' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
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
          Projects
        </motion.h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + New Project
          </button>
        </motion.div>
      </div>

      {projects.length === 0 ? (
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
            📁
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Create your first project to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
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
              className="card group"
            >
              <Link to={`/projects/${project._id}`} className="block mb-4">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 bg-gradient-to-br from-royal-500 to-royal-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-royal-500/30"
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="px-3 py-1 bg-royal-500/20 text-royal-400 text-xs font-semibold rounded-full border border-royal-500/30">
                    {project.platform}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-royal-400 transition-colors">{project.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{project.domain}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-gray-200">{project.subscribers?.length || 0}</p>
                    <p className="text-gray-500">Subscribers</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">{project.notifications?.length || 0}</p>
                    <p className="text-gray-500">Campaigns</p>
                  </div>
                </div>
              </Link>
              <div className="mt-4 pt-4 border-t border-dark-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(project._id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl shadow-2xl p-6 max-w-md w-full border border-dark-700/50"
            >
              <h2 className="text-2xl font-bold text-gray-200 mb-6">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="My Website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="input-field"
                    placeholder="example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="input-field"
                  >
                    <option value="website">Website</option>
                    <option value="wordpress">WordPress</option>
                    <option value="shopify">Shopify</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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

export default Projects;

