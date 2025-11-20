import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  slug: string;
  description: string;
  iconPath: string;
  zipFilePath: string;
  extractPath: string;
  uploadDate: Date;
  isActive: boolean;
  categories?: mongoose.Types.ObjectId[];
}

const GameSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: false, // Optional for backward compatibility, will be populated by migration
    trim: true,
    unique: true,
    sparse: true, // Allows multiple null/undefined values
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  iconPath: {
    type: String,
    required: true
  },
  zipFilePath: {
    type: String,
    required: true
  },
  extractPath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema, 'gamesData');