import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
    trim: true
  },
  examDate: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam; 