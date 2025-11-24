import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  hideSection: boolean; // Hide entire categories section from frontend
  hideCategory: boolean; // Hide individual category from frontend
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  hideSection: {
    type: Boolean,
    default: false
  },
  hideCategory: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');

