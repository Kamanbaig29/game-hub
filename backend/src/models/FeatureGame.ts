import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureGame extends Document {
  gameId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
  position: number; // Dynamic position number (1, 2, 3, ...)
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
    required: true
  },
  position: {
    type: Number,
    required: true,
    min: 1,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IFeatureGame>('FeatureGame', FeatureGameSchema, 'featureGames');

