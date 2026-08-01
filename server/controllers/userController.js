import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'Administrator') {
      return res.status(400).json({ message: 'Cannot block Administrator users' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: user.isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
      details: `${user.name} (${user.email}) was ${user.isBlocked ? 'blocked' : 'unblocked'}`,
    });

    res.json({ message: `User status updated to ${user.isBlocked ? 'Blocked' : 'Active'}`, user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role || user.role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'Administrator') {
      return res.status(400).json({ message: 'Cannot delete Administrator account' });
    }

    await User.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_DELETED',
      details: `User ${user.name} (${user.email}) was deleted`,
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
