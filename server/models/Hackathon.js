import mongoose from 'mongoose';

const criterionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxMarks: { type: Number, default: 10 },
  weight: { type: Number, default: 1 },
});

const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Online' },
    venue: { type: String, default: 'Virtual Discord & Platform' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80' },
    prizePool: { type: String, default: '$10,000' },
    maxTeamSize: { type: Number, default: 4 },
    rules: { type: String, default: 'Follow code of conduct. Original code built during hackathon window only.' },
    criteria: [criterionSchema],
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Upcoming', 'Registration Open', 'Ongoing', 'Under Review', 'Completed'],
      default: 'Registration Open',
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Hackathon', hackathonSchema);
