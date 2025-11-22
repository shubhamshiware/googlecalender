import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  start: Date;
  end: Date;
  userId: mongoose.Types.ObjectId;
  color: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  category: 'Work' | 'Personal' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    start: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    end: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    color: {
      type: String,
      default: '#3B82F6',
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Other'],
      default: 'Personal',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
