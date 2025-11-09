import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    performance: {
      totalReports: {
        type: Number,
        default: 0,
      },
      completedReports: {
        type: Number,
        default: 0,
      },
      averageTime: {
        type: Number, // in minutes
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;
