import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import gameRoutes from './routes/gameRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// CORS handled by nginx
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads'), {
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

// Static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route for SPA (must be last)
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API or upload paths
  if (req.path.startsWith('/api/') || req.path.startsWith('/src/uploads/')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});