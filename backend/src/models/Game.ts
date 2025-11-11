import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  iconPath: string;
  zipFilePath: string;
  extractPath: string;
  uploadDate: Date;
  isActive: boolean;
}

const GameSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
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
  }
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema, 'gamesData');