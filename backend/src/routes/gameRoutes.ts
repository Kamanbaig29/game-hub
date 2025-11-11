import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';
import Game from '../models/Game.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'icon') {
      cb(null, 'src/uploads/gameIcons');
    } else if (file.fieldname === 'zipFile') {
      cb(null, 'src/uploads/gameBuilds');
    }
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4().substring(0, 8);
    const title = req.body.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'game';
    const ext = path.extname(file.originalname);
    cb(null, `${title}_${uniqueId}${ext}`);
  }
});

const upload = multer({ storage });

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Create new game with file uploads
router.post('/', upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'zipFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.icon || !files.zipFile) {
      return res.status(400).json({ error: 'Both icon and zip file are required' });
    }

    const zipFile = files.zipFile[0];
    const uniqueId = uuidv4().substring(0, 8);
    const title = req.body.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'game';
    const extractPath = `src/uploads/gameBuilds/${title}_${uniqueId}`;

    // Extract zip file
    const zip = new AdmZip(zipFile.path);
    zip.extractAllTo(extractPath, true);

    // Find the actual build folder (look for index.html)
    const findBuildPath = (dir: string): string => {
      const items = fs.readdirSync(dir);
      
      // Check if index.html exists in current directory
      if (items.includes('index.html')) {
        return dir;
      }
      
      // Look in subdirectories
      for (const item of items) {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          const buildPath = findBuildPath(itemPath);
          if (buildPath) return buildPath;
        }
      }
      
      return dir; // fallback to original path
    };

    const actualBuildPath = findBuildPath(extractPath);

    // Remove the zip file after extraction
    fs.unlinkSync(zipFile.path);

    const gameData = {
      title: req.body.title,
      description: req.body.description,
      iconPath: files.icon[0].path,
      zipFilePath: actualBuildPath,
      extractPath: extractPath
    };

    const game = new Game(gameData);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create game' });
  }
});

// Toggle game active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    game.isActive = !game.isActive;
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle game status' });
  }
});

// Permanently delete game and files
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Delete icon file
    if (fs.existsSync(game.iconPath)) {
      fs.unlinkSync(game.iconPath);
    }

    // Delete entire extracted folder (not just build path)
    if (fs.existsSync(game.extractPath)) {
      fs.rmSync(game.extractPath, { recursive: true, force: true });
    }

    // Delete from database
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export default router;