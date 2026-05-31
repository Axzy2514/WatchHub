import { Router } from 'express';
import { watchlistController } from '../controllers/watchlistController';

const router = Router();

router.get('/export', watchlistController.exportWatchlist);
router.post('/import', watchlistController.importWatchlist);
router.get('/stats', watchlistController.getStats);
router.get('/by-external', watchlistController.getByExternalId);

router.get('/', watchlistController.getAll);
router.get('/:id', watchlistController.getById);
router.post('/', watchlistController.create);
router.put('/:id', watchlistController.update);
router.delete('/:id', watchlistController.delete);

export default router;
