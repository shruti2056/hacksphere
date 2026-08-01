import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hacksphere_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const validRoles = ['Administrator', 'Organizer', 'Participant', 'Judge'];
    const userRole = validRoles.includes(role) ? role : 'Participant';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      organization: organization || 'HackSphere Community',
      bio: bio || '',
    });

    await ActivityLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTERED',
      details: `New ${user.role} account created for ${user.email}`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      organization: user.organization,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked by Administrator. Contact support.' });
    }

    await ActivityLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      details: `${user.name} (${user.role}) logged in`,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      organization: user.organization,
      bio: user.bio,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.organization = req.body.organization || user.organization;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      organization: updatedUser.organization,
      bio: updatedUser.bio,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    next(error);
  }
};
