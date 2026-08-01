import Hackathon from '../models/Hackathon.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

export const createHackathon = async (req, res, next) => {
  try {
    const {
      title,
      description,
      theme,
      mode,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      bannerImage,
      prizePool,
      maxTeamSize,
      rules,
      criteria,
    } = req.body;

    const defaultCriteria = criteria && criteria.length > 0 ? criteria : [
      { name: 'Innovation & Originality', maxMarks: 10, weight: 1 },
      { name: 'Technical Complexity', maxMarks: 10, weight: 1 },
      { name: 'UI / UX Design', maxMarks: 10, weight: 1 },
      { name: 'Functionality & Feasibility', maxMarks: 10, weight: 1 },
      { name: 'Scalability & Potential', maxMarks: 10, weight: 1 },
      { name: 'Presentation & Pitch', maxMarks: 10, weight: 1 },
    ];

    const hackathon = await Hackathon.create({
      title,
      description,
      theme,
      mode: mode || 'Online',
      venue: venue || 'Virtual Platform',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      registrationDeadline: registrationDeadline || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      prizePool: prizePool || '$10,000',
      maxTeamSize: maxTeamSize || 4,
      rules: rules || 'Build innovative solutions adhering to hackathon theme.',
      criteria: defaultCriteria,
      organizerId: req.user._id,
      judges: [],
      status: 'Registration Open',
    });

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'HACKATHON_CREATED',
      details: `Hackathon '${hackathon.title}' created by ${req.user.name}`,
    });

    res.status(201).json(hackathon);
  } catch (error) {
    next(error);
  }
};

export const getHackathons = async (req, res, next) => {
  try {
    const { search, mode, status, theme } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { theme: { $regex: search, $options: 'i' } },
      ];
    }

    if (mode) query.mode = mode;
    if (status) query.status = status;
    if (theme) query.theme = { $regex: theme, $options: 'i' };

    const hackathons = await Hackathon.find(query)
      .populate('organizerId', 'name email avatar organization')
      .populate('judges', 'name email avatar organization bio')
      .sort({ createdAt: -1 });

    res.json(hackathons);
  } catch (error) {
    next(error);
  }
};

export const getHackathonById = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizerId', 'name email avatar organization')
      .populate('judges', 'name email avatar organization bio');

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(hackathon);
  } catch (error) {
    next(error);
  }
};

export const updateHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    // Check ownership or admin status
    if (req.user.role !== 'Administrator' && hackathon.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this hackathon' });
    }

    Object.assign(hackathon, req.body);
    await hackathon.save();

    res.json(hackathon);
  } catch (error) {
    next(error);
  }
};

export const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    if (req.user.role !== 'Administrator' && hackathon.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    await Hackathon.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'HACKATHON_DELETED',
      details: `Hackathon '${hackathon.title}' deleted`,
    });

    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const assignJudges = async (req, res, next) => {
  try {
    const { judgeIds } = req.body; // Array of judge user IDs
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    if (req.user.role !== 'Administrator' && hackathon.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to assign judges to this hackathon' });
    }

    hackathon.judges = judgeIds;
    await hackathon.save();

    res.json({ message: 'Judges assigned successfully', judges: hackathon.judges });
  } catch (error) {
    next(error);
  }
};
