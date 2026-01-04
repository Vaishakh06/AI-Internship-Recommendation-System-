import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  bio: { type: String, default: '' },
  skills: [{ type: String }],

  education: {
    university: { type: String, default: '' },
    degree: { type: String, default: '' },
    graduationYear: { type: Number },
  },
  experience: [
    {
      title: { type: String },
      company: { type: String },
      description: { type: String },
    },
  ],

  portfolioLink: { type: String, default: '' },
  resumeLink: { type: String, default: '' },

  appliedInternships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
    },
  ],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
