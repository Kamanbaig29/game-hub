import mongoose, { Schema, Document } from 'mongoose';

export interface IComingSoon extends Document {
  name: string;
  description: string;
  iconPath: string;
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
  }
}, {
  timestamps: true
});

export default mongoose.model<IComingSoon>('ComingSoon', ComingSoonSchema, 'comingSoon');

