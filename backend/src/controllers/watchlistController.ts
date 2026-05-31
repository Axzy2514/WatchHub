import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlistService';
import { MediaType, WatchStatus } from '../models/WatchlistEntry';

export const watchlistController = {
  async getAll(req: Request, res: Response) {
    try {
      const {
        search,
        type,
        status,
        favorite,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const result = await watchlistService.getAll({
        search: search as string,
        type: type as MediaType,
        status: status as WatchStatus,
        favorite: favorite === 'true' ? true : favorite === 'false' ? false : undefined,
        sortBy: sortBy as 'createdAt' | 'watchedAt' | 'personalRating' | 'title',
        sortOrder: sortOrder as 'asc' | 'desc',
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch watchlist', details: String(error) });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const entry = await watchlistService.getById(req.params.id);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch entry', details: String(error) });
    }
  },

  async getByExternalId(req: Request, res: Response) {
    try {
      const { externalId, type } = req.query;
      if (!externalId || !type) {
        return res.status(400).json({ error: 'externalId and type are required' });
      }
      const entry = await watchlistService.getByExternalId(externalId as string, type as MediaType);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch entry', details: String(error) });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { externalId, type, title } = req.body;
      if (!externalId || !type || !title) {
        return res.status(400).json({ error: 'externalId, type, and title are required' });
      }

      // Check for duplicate
      const existing = await watchlistService.getByExternalId(externalId, type);
      if (existing) {
        return res.status(409).json({ error: 'Entry already exists in watchlist', entry: existing });
      }

      const entry = await watchlistService.create(req.body);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create entry', details: String(error) });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const entry = await watchlistService.update(req.params.id, req.body);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update entry', details: String(error) });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await watchlistService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Entry not found' });
      res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete entry', details: String(error) });
    }
  },

  async getStats(req: Request, res: Response) {
    try {
      const stats = await watchlistService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats', details: String(error) });
    }
  },

  async exportWatchlist(req: Request, res: Response) {
    try {
      const { entries } = await watchlistService.getAll({ limit: 10000 });
      res.setHeader('Content-Disposition', 'attachment; filename="watchvault-export.json"');
      res.setHeader('Content-Type', 'application/json');
      res.json({ version: '1.0', exportedAt: new Date().toISOString(), entries });
    } catch (error) {
      res.status(500).json({ error: 'Failed to export watchlist', details: String(error) });
    }
  },

  async importWatchlist(req: Request, res: Response) {
    try {
      const { entries } = req.body;
      if (!Array.isArray(entries)) {
        return res.status(400).json({ error: 'Invalid import format. Expected { entries: [...] }' });
      }
      const result = await watchlistService.importEntries(entries);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to import watchlist', details: String(error) });
    }
  },
};
