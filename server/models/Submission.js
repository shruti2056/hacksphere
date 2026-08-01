import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    projectName: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    description: { type: String, required: true },
    githubUrl: { type: String, required: true },
    liveDemoUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    techStack: [{ type: String }],
    screenshots: [{ type: String }],
    presentationPdf: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Under Review',
    },
    totalScore: { type: Number, default: 0 },
    evaluationsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
