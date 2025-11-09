import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates',
        },
      },
    },
    address: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
    notes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create geospatial index
reportSchema.index({ location: '2dsphere' });

const Report = mongoose.model('Report', reportSchema);

export default Report;
