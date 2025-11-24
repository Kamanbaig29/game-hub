import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureGame extends Document {
  gameId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
  position: number; // Dynamic position number (1, 2, 3, ...)
  hideSection: boolean; // Hide entire feature section from frontend
  createdAt: Date;
  updatedAt: Date;
}

const FeatureGameSchema: Schema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: false
  },
  position: {
    type: Number,
    required: true,
    min: 1,
    unique: true
  },
  hideSection: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IFeatureGame>('FeatureGame', FeatureGameSchema, 'featureGames');

