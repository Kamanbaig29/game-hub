import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import gameRoutes from './routes/gameRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import featureGameRoutes from './routes/featureGameRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import comingSoonRoutes from './routes/comingSoonRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:6001',
      'http://localhost:5173', 
      'http://localhost:5001',
      'http://localhost:7000',
      'http://localhost:8000',
      'https://contact.cryptoverse.games',
      'https://cryptoverse.games',
      'https://admin.cryptoverse.games'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/src/uploads', express.static(path.join(__dirname, '../src/uploads'), {
  setHeaders: (res, filePath) => {
    // Set proper MIME types for Unity files
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (filePath.endsWith('.data')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.br')) {
      res.setHeader('Content-Encoding', 'br');
      res.setHeader('Content-Type', 'application/javascript');
    }
    
    // Enable aggressive caching for Unity files
    if (filePath.match(/\.(wasm|data|js|symbols\.json|br)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Vary', 'Accept-Encoding');
    }
  }
}));

// API routes first
app.use('/api/games', gameRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feature-games', featureGameRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coming-soon', comingSoonRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route for SPA (must be last)
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API or upload paths
  if (req.path.startsWith('/api/') || req.path.startsWith('/src/uploads/')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});