import Team from '../models/Team.js';
import Hackathon from '../models/Hackathon.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const generateTeamCode = () => {
  return 'HS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, hackathonId } = req.body;
    if (!name || !hackathonId) {
      return res.status(400).json({ message: 'Team name and hackathonId are required' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    // Check if user is already in a team for this hackathon
    const existingTeam = await Team.findOne({
      hackathonId,
      'members.userId': req.user._id,
    });

    if (existingTeam) {
      return res.status(400).json({ message: 'You are already a member of a team in this hackathon' });
    }

    const code = generateTeamCode();
    const team = await Team.create({
      name,
      code,
      hackathonId,
      leaderId: req.user._id,
      members: [{ userId: req.user._id, role: 'Leader' }],
      status: 'Approved',
    });

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'TEAM_CREATED',
      details: `Team '${team.name}' (Code: ${team.code}) created for hackathon ${hackathon.title}`,
    });

    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const joinTeamByCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Team code is required' });

    const team = await Team.findOne({ code: code.trim().toUpperCase() });
    if (!team) return res.status(404).json({ message: 'Invalid team code' });

    const hackathon = await Hackathon.findById(team.hackathonId);
    if (team.members.length >= (hackathon?.maxTeamSize || 4)) {
      return res.status(400).json({ message: `Team is full (Max ${hackathon?.maxTeamSize || 4} members)` });
    }

    // Check if user is already in any team for this hackathon
    const inAnyTeam = await Team.findOne({
      hackathonId: team.hackathonId,
      'members.userId': req.user._id,
    });

    if (inAnyTeam) {
      return res.status(400).json({ message: 'You are already in a team for this hackathon' });
    }

    team.members.push({ userId: req.user._id, role: 'Member' });
    await team.save();

    res.json({ message: 'Successfully joined team!', team });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('hackathonId')
      .populate('members.userId', 'name email avatar organization bio')
      .populate('leaderId', 'name email avatar');

    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const getHackathonTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ hackathonId: req.params.hackathonId })
      .populate('members.userId', 'name email avatar organization')
      .populate('leaderId', 'name email avatar');

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getUserTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ 'members.userId': req.user._id })
      .populate('hackathonId')
      .populate('members.userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const transferLeadership = async (req, res, next) => {
  try {
    const { newLeaderId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leaderId.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Only team leader or admin can transfer leadership' });
    }

    const memberExists = team.members.find(m => m.userId.toString() === newLeaderId);
    if (!memberExists) {
      return res.status(400).json({ message: 'Selected new leader is not a member of this team' });
    }

    team.leaderId = newLeaderId;
    team.members.forEach(m => {
      if (m.userId.toString() === newLeaderId) {
        m.role = 'Leader';
      } else if (m.userId.toString() === req.user._id.toString()) {
        m.role = 'Member';
      }
    });

    await team.save();
    res.json({ message: 'Team leadership transferred successfully', team });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { memberUserId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leaderId.toString() !== req.user._id.toString() && 
        req.user._id.toString() !== memberUserId && 
        req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to remove this member' });
    }

    team.members = team.members.filter(m => m.userId.toString() !== memberUserId);
    await team.save();

    res.json({ message: 'Member removed from team', team });
  } catch (error) {
    next(error);
  }
};

export const approveRejectTeam = async (req, res, next) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const hackathon = await Hackathon.findById(team.hackathonId);
    if (req.user.role !== 'Administrator' && hackathon.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only hackathon organizer or admin can approve/reject teams' });
    }

    team.status = status;
    await team.save();

    res.json({ message: `Team status updated to ${status}`, team });
  } catch (error) {
    next(error);
  }
};
