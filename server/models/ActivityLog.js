import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'System' },
    userRole: { type: String, default: 'System' },
    action: { type: String, required: true },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
