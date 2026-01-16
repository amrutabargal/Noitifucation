const express = require('express');
const Automation = require('../models/Automation');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all automations for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const automations = await Automation.find({ project: req.params.projectId })
      .populate('action.notification')
      .sort({ createdAt: -1 });

    res.json(automations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single automation
router.get('/:id', auth, async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('project')
      .populate('action.notification');

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    const project = await Project.findOne({
      _id: automation.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(automation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create automation
router.post('/', auth, async (req, res) => {
  try {
    const { projectId, name, description, trigger, action, targetAudience } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const automation = await Automation.create({
      project: projectId,
      name,
      description,
      trigger,
      action,
      targetAudience: targetAudience || {}
    });

    res.status(201).json(automation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update automation
router.put('/:id', auth, async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('project');

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    const project = await Project.findOne({
      _id: automation.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(automation, req.body);
    automation.updatedAt = new Date();
    await automation.save();

    res.json(automation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete automation
router.delete('/:id', auth, async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('project');

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    const project = await Project.findOne({
      _id: automation.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Automation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Automation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

