import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Restrict role assignment - only superadmin can create admin users
    // Regular registration can only create 'citizen' role
    let userRole = 'citizen';
    if (role) {
      // Only allow superadmin to assign admin or worker roles
      // Check if requester is superadmin (would need to be passed via token)
      // For now, restrict registration to citizen only
      // Admin and superadmin users should be created directly in database or via superadmin panel
      if (role === 'admin' || role === 'worker' || role === 'superadmin') {
        return res.status(403).json({ 
          message: 'Cannot register with this role. Please contact administrator.' 
        });
      }
      userRole = role;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });
    console.log('Login attempt for email:', email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User role:', user.role);
      const isPasswordMatch = await user.matchPassword(password);
      console.log('Password match:', isPasswordMatch);
      
      if (isPasswordMatch) {
        const token = generateToken(user._id);
        const response = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
          mustChangePassword: user.mustChangePassword || false,
        };
        console.log('Login successful for user:', user.email, 'Role:', user.role);
        res.json(response);
      } else {
        console.log('Password mismatch for user:', email);
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      console.log('User not found for email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    // Include mustChangePassword in response
    const userResponse = {
      ...user.toObject(),
      mustChangePassword: user.mustChangePassword || false,
    };
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a password reset request has been submitted to the administrator.' 
      });
    }

    // Set password reset requested flag
    user.passwordResetRequested = true;
    await user.save();

    res.json({ 
      message: 'If an account with that email exists, a password reset request has been submitted to the administrator.' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password (for users who must change password after reset)
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both old and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isPasswordMatch = await user.matchPassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    user.mustChangePassword = false;
    user.passwordResetBy = null;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};