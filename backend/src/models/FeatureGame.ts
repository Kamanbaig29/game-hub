import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureGame extends Document {
  gameId: mongoose.Types.ObjectId;
  tag: 'hot' | 'new' | 'trending' | 'updated';
  position: number; // 1-6
  createdAt: Date;
  updatedAt: Date;
}

const FeatureGameSchema: Schema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  tag: {
    type: String,
    enum: ['hot', 'new', 'trending', 'updated'],
    required: true
  },
  position: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IFeatureGame>('FeatureGame', FeatureGameSchema, 'featureGames');

