import User from '../models/User.js';
import Report from '../models/Report.js';
import Team from '../models/Team.js';
import mongoose from 'mongoose';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const completedReports = await Report.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();

    // Reports by priority
    const reportsByPriority = await Report.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Reports by status
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent reports (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReports = await Report.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Average completion time
    const completedReportsWithTime = await Report.find({
      status: 'completed',
      completedAt: { $ne: null },
    });

    let avgCompletionTime = 0;
    if (completedReportsWithTime.length > 0) {
      const totalTime = completedReportsWithTime.reduce((acc, report) => {
        const timeDiff = report.completedAt - report.createdAt;
        return acc + timeDiff;
      }, 0);
      avgCompletionTime = Math.round(totalTime / completedReportsWithTime.length / (1000 * 60)); // in minutes
    }

    res.json({
      totalReports,
      pendingReports,
      inProgressReports,
      completedReports,
      totalUsers,
      totalTeams,
      recentReports,
      avgCompletionTime,
      reportsByPriority,
      reportsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    // Filter users based on role:
    // - Admin (municipal) can only see citizen and worker users
    // - Superadmin can see all users
    let filter = {};
    if (req.user.role === 'admin') {
      // Municipal admin can only see citizen and worker users
      filter = { role: { $in: ['citizen', 'worker'] } };
    }
    // Superadmin can see all users (no filter)

    const users = await User.find(filter).select('-password').populate('team', 'name').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private (Admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Restrict role assignment: Only superadmin can create admin or superadmin users
    const userRole = role || 'citizen';
    if ((userRole === 'admin' || userRole === 'superadmin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Only superadmin can create admin or superadmin users' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: userRole,
    });

    const userResponse = await User.findById(user._id).select('-password').populate('team', 'name');

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, team } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow updating the admin user's own role (security measure)
    if (req.params.id === req.user._id.toString() && role && role !== req.user.role) {
      return res.status(403).json({ message: 'You cannot change your own role' });
    }

    // Restrict role assignment: Only superadmin can assign admin or superadmin roles
    if (role && (role === 'admin' || role === 'superadmin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Only superadmin can assign admin or superadmin roles' 
      });
    }

    // Prevent non-superadmin from changing existing admin/superadmin roles
    if (role && (user.role === 'admin' || user.role === 'superadmin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Only superadmin can modify admin or superadmin users' 
      });
    }

    if (name) user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (team !== undefined) user.team = team || null;

    const updatedUser = await user.save();
    const userResponse = await User.findById(updatedUser._id)
      .select('-password')
      .populate('team', 'name');

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    // Don't allow deleting yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teams
// @route   GET /api/admin/teams
// @access  Private (Admin)
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('members', 'name email role')
      .populate('leader', 'name email role')
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team
// @route   POST /api/admin/teams
// @access  Private (Admin)
export const createTeam = async (req, res) => {
  try {
    const { name, memberIds, leaderId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide team name' });
    }

    const team = await Team.create({
      name,
      members: memberIds || [],
      leader: leaderId || null,
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email')
      .populate('leader', 'name email');

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/admin/teams/:id
// @access  Private (Admin)
export const updateTeam = async (req, res) => {
  try {
    const { name, memberIds, leaderId, status } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (name) team.name = name;
    if (memberIds) team.members = memberIds;
    if (leaderId) team.leader = leaderId;
    if (status) team.status = status;

    const updatedTeam = await team.save();
    const populatedTeam = await Team.findById(updatedTeam._id)
      .populate('members', 'name email')
      .populate('leader', 'name email');

    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get route optimization (simple nearest neighbor)
// @route   GET /api/admin/optimize-routes
// @access  Private (Admin)
export const optimizeRoutes = async (req, res) => {
  try {
    const { teamId, maxReports = 10 } = req.query;

    // Get pending and assigned reports
    const reports = await Report.find({
      status: { $in: ['pending', 'assigned'] },
      ...(teamId ? { assignedTeam: teamId } : {}),
    })
      .sort({ priority: -1, createdAt: 1 })
      .limit(parseInt(maxReports));

    // Simple optimization: sort by distance from a central point
    // In production, use a proper TSP solver
    const centerLat = req.query.centerLat || 0;
    const centerLng = req.query.centerLng || 0;

    const reportsWithDistance = reports.map((report) => ({
      report,
      distance: calculateDistance(
        centerLat,
        centerLng,
        report.location.coordinates[1],
        report.location.coordinates[0]
      ),
    }));

    reportsWithDistance.sort((a, b) => {
      // Priority first, then distance
      if (a.report.priority !== b.report.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.report.priority] - priorityOrder[a.report.priority];
      }
      return a.distance - b.distance;
    });

    const optimizedRoute = reportsWithDistance.map((item) => ({
      reportId: item.report._id,
      location: item.report.location.coordinates,
      priority: item.report.priority,
      description: item.report.description,
      distance: item.distance,
    }));

    res.json({
      route: optimizedRoute,
      totalReports: optimizedRoute.length,
      estimatedTime: optimizedRoute.length * 30, // 30 minutes per report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get password reset requests
// @route   GET /api/admin/password-reset-requests
// @access  Private (Superadmin only)
export const getPasswordResetRequests = async (req, res) => {
  try {
    // Only superadmin can see password reset requests
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin only.' });
    }

    const users = await User.find({ passwordResetRequested: true })
      .select('name email role passwordResetRequested createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset user password (superadmin only)
// @route   POST /api/admin/reset-password/:userId
// @access  Private (Superadmin only)
export const resetUserPassword = async (req, res) => {
  try {
    // Only superadmin can reset passwords
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin only.' });
    }

    const { newPassword } = req.body;
    const { userId } = req.params;

    if (!newPassword) {
      return res.status(400).json({ message: 'Please provide a new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset password
    user.password = newPassword;
    user.passwordResetRequested = false;
    user.mustChangePassword = true; // User must change password on next login
    user.passwordResetBy = req.user._id;
    await user.save();

    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('passwordResetBy', 'name email');

    res.json({ 
      message: 'Password reset successfully. User will be required to change password on next login.',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
