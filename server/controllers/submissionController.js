import Submission from '../models/Submission.js';
import Team from '../models/Team.js';
import Hackathon from '../models/Hackathon.js';

// @desc  Create or update my team's project submission
// @route POST /api/submissions
// @access Private/Participant/Administrator
export const createOrUpdateSubmission = async (req, res, next) => {
  try {
    const { teamId, hackathonId, ...data } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.some((m) => m.userId.toString() === req.user._id.toString());
    if (!isMember && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Only members of the team can submit a project' });
    }

    let submission = await Submission.findOne({ teamId });

    if (submission) {
      Object.assign(submission, data);
      await submission.save();
    } else {
      submission = await Submission.create({ ...data, teamId, hackathonId: hackathonId || team.hackathonId });
    }

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// @desc  Get my team's submission for a given hackathon
// @route GET /api/submissions/my/:hackathonId
// @access Private
export const getMySubmission = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      hackathonId: req.params.hackathonId,
      'members.userId': req.user._id,
    });

    if (!team) return res.json(null);

    const submission = await Submission.findOne({ teamId: team._id });
    res.json(submission || null);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all submissions for a hackathon (organizer/admin/judge view)
// @route GET /api/submissions/hackathon/:hackathonId
// @access Private/Organizer/Administrator/Judge
export const getSubmissionsForHackathon = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ hackathonId: req.params.hackathonId })
      .populate('teamId', 'name leaderId members')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single submission
// @route GET /api/submissions/:id
// @access Private
export const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('teamId', 'name leaderId members')
      .populate('hackathonId', 'title criteria organizerId');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// @desc  Edit a project submission — used by the owning team (content only)
//        AND by the hackathon's organizer/admin (content + status)
// @route PUT /api/submissions/:id
// @access Private
export const updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const hackathon = await Hackathon.findById(submission.hackathonId);
    const isAdmin = req.user.role === 'Administrator';
    const isOwningOrganizer = req.user.role === 'Organizer' && hackathon?.organizerId?.toString() === req.user._id.toString();

    let isTeamMember = false;
    if (req.user.role === 'Participant') {
      const team = await Team.findById(submission.teamId);
      isTeamMember = !!team && team.members.some((m) => m.userId.toString() === req.user._id.toString());
    }

    if (!isAdmin && !isOwningOrganizer && !isTeamMember) {
      return res.status(403).json({ message: 'You are not authorized to edit this submission' });
    }

    const contentFields = [
      'projectName',
      'problemStatement',
      'solution',
      'description',
      'githubUrl',
      'liveDemoUrl',
      'videoUrl',
      'techStack',
      'screenshots',
      'presentationPdf',
    ];

    contentFields.forEach((field) => {
      if (req.body[field] !== undefined) submission[field] = req.body[field];
    });

    // Only the organizer/admin can change review status
    if ((isAdmin || isOwningOrganizer) && req.body.status !== undefined) {
      submission.status = req.body.status;
    }

    await submission.save();
    res.json(submission);
  } catch (error) {
    next(error);
  }
};
