import { WatchlistEntry, IWatchlistEntry, MediaType, WatchStatus } from '../models/WatchlistEntry';
import { FilterQuery, SortOrder } from 'mongoose';

export interface CreateEntryDto {
  externalId: string;
  type: MediaType;
  title: string;
  imageUrl?: string;
  year?: number;
  status: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite?: boolean;
  watchedAt?: Date;
}

export interface UpdateEntryDto {
  status?: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite?: boolean;
  watchedAt?: Date;
}

export interface WatchlistQuery {
  search?: string;
  type?: MediaType;
  status?: WatchStatus;
  favorite?: boolean;
  sortBy?: 'createdAt' | 'watchedAt' | 'personalRating' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class WatchlistService {
  async getAll(query: WatchlistQuery = {}): Promise<{ entries: IWatchlistEntry[]; total: number }> {
    const {
      search,
      type,
      status,
      favorite,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = query;

    const filter: FilterQuery<IWatchlistEntry> = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (favorite !== undefined) filter.favorite = favorite;

    const sort: Record<string, SortOrder> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const skip = (page - 1) * limit;
    const [entries, total] = await Promise.all([
      WatchlistEntry.find(filter).sort(sort).skip(skip).limit(limit).lean<IWatchlistEntry[]>(),
      WatchlistEntry.countDocuments(filter),
    ]);

    return { entries, total };
  }

  async getById(id: string): Promise<IWatchlistEntry | null> {
    return WatchlistEntry.findById(id).lean() as Promise<IWatchlistEntry | null>;
  }

  async getByExternalId(externalId: string, type: MediaType): Promise<IWatchlistEntry | null> {
    return WatchlistEntry.findOne({ externalId, type }).lean() as Promise<IWatchlistEntry | null>;
  }

  async create(data: CreateEntryDto): Promise<IWatchlistEntry> {
    const entry = new WatchlistEntry(data);
    return entry.save();
  }

  async update(id: string, data: UpdateEntryDto): Promise<IWatchlistEntry | null> {
    return WatchlistEntry.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean() as Promise<IWatchlistEntry | null>;
  }

  async delete(id: string): Promise<boolean> {
    const result = await WatchlistEntry.findByIdAndDelete(id);
    return !!result;
  }

  async getStats() {
    const stats = await WatchlistEntry.aggregate([
      {
        $group: {
          _id: null,
          totalAnime: { $sum: { $cond: [{ $eq: ['$type', 'anime'] }, 1, 0] } },
          totalMovies: { $sum: { $cond: [{ $eq: ['$type', 'movie'] }, 1, 0] } },
          totalSeries: { $sum: { $cond: [{ $eq: ['$type', 'series'] }, 1, 0] } },
          totalFavorites: { $sum: { $cond: ['$favorite', 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          watching: { $sum: { $cond: [{ $eq: ['$status', 'watching'] }, 1, 0] } },
          dropped: { $sum: { $cond: [{ $eq: ['$status', 'dropped'] }, 1, 0] } },
          planToWatch: { $sum: { $cond: [{ $eq: ['$status', 'plan_to_watch'] }, 1, 0] } },
          avgRating: { $avg: '$personalRating' },
          totalRated: { $sum: { $cond: [{ $ne: ['$personalRating', null] }, 1, 0] } },
        },
      },
    ]);

    const recentlyAdded = await WatchlistEntry.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const recentlyWatched = await WatchlistEntry.find({ watchedAt: { $ne: null } })
      .sort({ watchedAt: -1 })
      .limit(6)
      .lean();

    const ratingDistribution = await WatchlistEntry.aggregate([
      { $match: { personalRating: { $ne: null } } },
      { $group: { _id: '$personalRating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const typeDistribution = await WatchlistEntry.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const statusDistribution = await WatchlistEntry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      ...(stats[0] || {
        totalAnime: 0,
        totalMovies: 0,
        totalSeries: 0,
        totalFavorites: 0,
        completed: 0,
        watching: 0,
        dropped: 0,
        planToWatch: 0,
        avgRating: null,
        totalRated: 0,
      }),
      recentlyAdded,
      recentlyWatched,
      ratingDistribution,
      typeDistribution,
      statusDistribution,
    };
  }

  async importEntries(entries: CreateEntryDto[]): Promise<{ imported: number; skipped: number }> {
    let imported = 0;
    let skipped = 0;

    for (const entry of entries) {
      try {
        const existing = await WatchlistEntry.findOne({
          externalId: entry.externalId,
          type: entry.type,
        });
        if (existing) {
          skipped++;
          continue;
        }
        await WatchlistEntry.create(entry);
        imported++;
      } catch {
        skipped++;
      }
    }

    return { imported, skipped };
  }
}

export const watchlistService = new WatchlistService();
