import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color: string; // Hex color code for the tag
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  color: {
    type: String,
    required: true,
    default: '#9945ff',
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  }
}, {
  timestamps: true
});

export default mongoose.model<ITag>('Tag', TagSchema, 'tags');

