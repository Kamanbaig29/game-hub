import mongoose, { Schema, Document } from 'mongoose';

export interface IComingSoon extends Document {
  name: string;
  description: string;
  iconPath: string;
  hideSection: boolean; // Hide entire coming soon section from frontend
  hideGame: boolean; // Hide individual game from frontend
  createdAt: Date;
  updatedAt: Date;
}

const ComingSoonSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  iconPath: {
    type: String,
    required: true
  },
  hideSection: {
    type: Boolean,
    default: false
  },
  hideGame: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IComingSoon>('ComingSoon', ComingSoonSchema, 'comingSoon');

