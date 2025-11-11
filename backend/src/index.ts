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

app.use(cors({
  origin: ['https://gamehub.memehome.io', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/src/uploads', express.static(path.join(__dirname, '../src/uploads')));

// API routes first
app.use('/api/games', gameRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route for SPA (must be last)
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for upload paths
  if (req.path.startsWith('/src/uploads/')) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});