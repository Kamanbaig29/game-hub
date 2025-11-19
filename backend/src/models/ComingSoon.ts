import mongoose, { Schema, Document } from 'mongoose';

export interface IComingSoon extends Document {
  name: string;
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
  iconPath: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IComingSoon>('ComingSoon', ComingSoonSchema, 'comingSoon');

