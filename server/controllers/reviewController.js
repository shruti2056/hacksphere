import Review from '../models/Review.js';
import Submission from '../models/Submission.js';
import Hackathon from '../models/Hackathon.js';
import ActivityLog from '../models/ActivityLog.js';

export const submitReview = async (req, res, next) => {
  try {
    const { submissionId, hackathonId, scores, comments } = req.body;

    if (!submissionId || !hackathonId || !scores || !Array.isArray(scores)) {
      return res.status(400).json({ message: 'SubmissionId, HackathonId, and scores array are required' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    // Check if user is an assigned judge or Admin
    const isJudgeAssigned = hackathon.judges.some(j => j.toString() === req.user._id.toString());
    if (!isJudgeAssigned && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'You are not assigned as a judge for this hackathon' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Calculate total score for this review
    const totalScore = scores.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);

    // Upsert review (one review per judge per submission)
    let review = await Review.findOne({ submissionId, judgeId: req.user._id });
    if (review) {
      review.scores = scores;
      review.comments = comments || review.comments;
      review.totalScore = totalScore;
      await review.save();
    } else {
      review = await Review.create({
        submissionId,
        hackathonId,
        judgeId: req.user._id,
        scores,
        comments: comments || '',
        totalScore,
      });
    }

    // Re-calculate aggregate total score for the submission across all judge reviews
    const allReviews = await Review.find({ submissionId });
    const aggregateScore = allReviews.reduce((sum, r) => sum + r.totalScore, 0) / (allReviews.length || 1);

    submission.totalScore = Math.round(aggregateScore * 10) / 10;
    submission.evaluationsCount = allReviews.length;
    submission.status = 'Under Review';
    await submission.save();

    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'PROJECT_EVALUATED',
      details: `Judge ${req.user.name} evaluated submission '${submission.projectName}' with score ${totalScore}`,
    });

    res.json({ message: 'Evaluation submitted successfully', review, submissionScore: submission.totalScore });
  } catch (error) {
    next(error);
  }
};

export const getJudgeAssignedSubmissions = async (req, res, next) => {
  try {
    // Find all hackathons where this judge is assigned
    const hackathons = await Hackathon.find({ judges: req.user._id });
    const hackathonIds = hackathons.map(h => h._id);

    const submissions = await Submission.find({ hackathonId: { $in: hackathonIds } })
      .populate('teamId')
      .populate('hackathonId');

    // Get existing reviews by this judge
    const judgeReviews = await Review.find({ judgeId: req.user._id });
    const reviewedMap = {};
    judgeReviews.forEach(r => {
      reviewedMap[r.submissionId.toString()] = r;
    });

    const result = submissions.map(sub => ({
      ...sub.toObject(),
      myReview: reviewedMap[sub._id.toString()] || null,
      isEvaluated: !!reviewedMap[sub._id.toString()],
    }));

    res.json({ assignedCount: result.length, submissions: result });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ submissionId: req.params.submissionId })
      .populate('judgeId', 'name email avatar organization bio');

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
