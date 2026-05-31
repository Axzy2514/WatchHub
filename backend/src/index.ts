import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import watchlistRoutes from './routes/watchlist';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/watchlist', watchlistRoutes);
app.use('/watchlist', watchlistRoutes); // Fallback for Vercel if routePrefix is stripped

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((error) => console.error('❌ Failed to connect to MongoDB:', error));
} else {
  console.error('❌ MONGODB_URI environment variable is not set');
}

// Only start the server locally, Vercel handles the Express app directly
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 WatchVault API running on http://localhost:${PORT}`);
  });
}

export default app;
