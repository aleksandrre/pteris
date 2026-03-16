import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

const sendTokenResponse = (res, user, statusCode) => {
  const token = generateToken(user._id);
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

// POST /api/auth/register  — გამოიყენე ერთხელ ადმინის შესაქმნელად, შემდეგ წაშალე
export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    const user = await User.create({ email, password, isAdmin: true });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      message: 'Admin registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(res, user, 200);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// PUT /api/auth/update-password  — protect + admin
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
