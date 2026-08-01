import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Leader', 'Member'], default: 'Member' },
  joinedAt: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
