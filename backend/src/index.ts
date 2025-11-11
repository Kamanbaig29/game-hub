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

app.use(cors());
app.use(express.json());
app.use('/src/uploads', express.static('src/uploads'));

// API routes first
app.use('/api/games', gameRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route for SPA (must be last)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});