import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  criterionName: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 10 },
  maxMarks: { type: Number, default: 10 }
});

const reviewSchema = new mongoose.Schema(
  {
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: [scoreSchema],
    comments: { type: String, default: '' },
    totalScore: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
