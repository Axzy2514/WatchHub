import mongoose, { Document, Schema } from 'mongoose';

export type MediaType = 'anime' | 'movie' | 'series';
export type WatchStatus = 'watching' | 'completed' | 'dropped' | 'plan_to_watch';

export interface IWatchlistEntry extends Document {
  externalId: string;
  type: MediaType;
  title: string;
  imageUrl?: string;
  year?: number;
  status: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite: boolean;
  watchedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistEntrySchema = new Schema<IWatchlistEntry>(
  {
    externalId: { type: String, required: true },
    type: { type: String, enum: ['anime', 'movie', 'series'], required: true },
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String },
    year: { type: Number },
    status: {
      type: String,
      enum: ['watching', 'completed', 'dropped', 'plan_to_watch'],
      required: true,
      default: 'plan_to_watch',
    },
    personalRating: { type: Number, min: 1, max: 10 },
    notes: { type: String, trim: true },
    favorite: { type: Boolean, default: false },
    watchedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicates
WatchlistEntrySchema.index({ externalId: 1, type: 1 }, { unique: true });

export const WatchlistEntry = mongoose.model<IWatchlistEntry>(
  'WatchlistEntry',
  WatchlistEntrySchema
);
