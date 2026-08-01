import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';
import Team from '../models/Team.js';
import Submission from '../models/Submission.js';
import Review from '../models/Review.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalHackathons = await Hackathon.countDocuments({});
    const totalTeams = await Team.countDocuments({});
    const totalSubmissions = await Submission.countDocuments({});
    const totalReviews = await Review.countDocuments({});

    const roleBreakdown = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const recentLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(10);

    res.json({
      totalUsers,
      totalHackathons,
      totalTeams,
      totalSubmissions,
      totalReviews,
      roleBreakdown,
      recentLogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizerStats = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ organizerId: req.user._id });
    const hackathonIds = hackathons.map(h => h._id);

    const totalTeams = await Team.countDocuments({ hackathonId: { $in: hackathonIds } });
    const totalSubmissions = await Submission.countDocuments({ hackathonId: { $in: hackathonIds } });

    res.json({
      myHackathonsCount: hackathons.length,
      totalTeams,
      totalSubmissions,
      hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const submissions = await Submission.find({ hackathonId })
      .populate('teamId')
      .populate('hackathonId')
      .sort({ totalScore: -1, createdAt: 1 });

    const leaderboard = submissions.map((sub, index) => {
      let position = 'Participant';
      if (index === 0) position = '🥇 1st Place Champion';
      else if (index === 1) position = '🥈 2nd Place Runner Up';
      else if (index === 2) position = '🥉 3rd Place Innovation Award';

      return {
        rank: index + 1,
        submissionId: sub._id,
        teamName: sub.teamId?.name || 'Unknown Team',
        teamCode: sub.teamId?.code || '',
        projectName: sub.projectName,
        problemStatement: sub.problemStatement,
        githubUrl: sub.githubUrl,
        liveDemoUrl: sub.liveDemoUrl,
        techStack: sub.techStack,
        totalScore: sub.totalScore,
        evaluationsCount: sub.evaluationsCount,
        position,
      };
    });

    res.json({ hackathonId, leaderboard });
  } catch (error) {
    next(error);
  }
};

export const getPublicGallery = async (req, res, next) => {
  try {
    const { search, tech } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { problemStatement: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (tech) {
      query.techStack = { $regex: tech, $options: 'i' };
    }

    const submissions = await Submission.find(query)
      .populate('teamId')
      .populate('hackathonId')
      .sort({ totalScore: -1, createdAt: -1 })
      .limit(30);

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
