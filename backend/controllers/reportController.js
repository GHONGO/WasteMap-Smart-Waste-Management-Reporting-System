import Report from '../models/Report.js';
import mongoose from 'mongoose';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { description, latitude, longitude, address, images, priority } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Please provide description' });
    }

    // Validate that we have either coordinates or address
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Please provide location coordinates (either by selecting on map or entering address)' 
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address: address || '',
      images: images || [],
      priority: priority || 'medium',
    });

    const populatedReport = await Report.findById(report._id)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name')
      .populate('assignedTo', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('new-report', populatedReport);
    }

    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
  try {
    const { status, priority, limit = 50, skip = 0 } = req.query;
    const filter = {};

    // Citizens can only see their own reports
    if (req.user.role === 'citizen') {
      filter.reporter = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Report.countDocuments(filter);

    res.json({ reports, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name members')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Citizens can only see their own reports
    if (req.user.role === 'citizen' && report.reporter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private (Admin/Worker)
export const updateReportStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status || report.status;

    if (status === 'completed') {
      report.completedAt = new Date();
    }

    if (note) {
      report.notes.push({
        user: req.user._id,
        note,
      });
    }

    const updatedReport = await report.save();
    const populatedReport = await Report.findById(updatedReport._id)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name')
      .populate('assignedTo', 'name email')
      .populate('notes.user', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`report-${req.params.id}`).emit('report-updated', populatedReport);
      io.emit('report-status-changed', { id: req.params.id, status });
    }

    res.json(populatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign report to team
// @route   PUT /api/reports/:id/assign
// @access  Private (Admin)
export const assignReport = async (req, res) => {
  try {
    const { teamId, userIds } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (teamId) {
      report.assignedTeam = teamId;
      report.status = 'assigned';
    }

    if (userIds && userIds.length > 0) {
      report.assignedTo = userIds;
      report.status = 'assigned';
    }

    const updatedReport = await report.save();
    const populatedReport = await Report.findById(updatedReport._id)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name members')
      .populate('assignedTo', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`report-${req.params.id}`).emit('report-assigned', populatedReport);
    }

    res.json(populatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports near location
// @route   GET /api/reports/nearby
// @access  Private
export const getNearbyReports = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide latitude and longitude' });
    }

    const filter = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    };

    // Citizens can only see their own reports
    if (req.user.role === 'citizen') {
      filter.reporter = req.user._id;
    }

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('assignedTeam', 'name')
      .limit(100);

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
