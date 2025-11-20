import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import Game from '../models/Game.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';

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

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}).populate('categories');
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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let extractPath: string | null = null;
  
  try {
    if (!files.icon || !files.zipFile) {
      return res.status(400).json({ error: 'Both icon and zip file are required' });
    }

    // Check if game title already exists
    const existingGame = await Game.findOne({ title: req.body.title.trim() });
    if (existingGame) {
      // Clean up uploaded files if title is duplicate
      if (files.icon && files.icon[0] && fs.existsSync(files.icon[0].path)) {
        fs.unlinkSync(files.icon[0].path);
      }
      if (files.zipFile && files.zipFile[0] && fs.existsSync(files.zipFile[0].path)) {
        fs.unlinkSync(files.zipFile[0].path);
      }
      return res.status(400).json({ error: 'A game with this title already exists. Please use a different title.' });
    }

    const zipFile = files.zipFile[0];
    const uniqueId = uuidv4().substring(0, 8);
    const title = req.body.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'game';
    extractPath = `src/uploads/gameBuilds/${title}_${uniqueId}`;

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

    // Parse categories from request body (can be comma-separated string or array)
    let categoryIds: string[] = [];
    if (req.body.categories) {
      if (Array.isArray(req.body.categories)) {
        categoryIds = req.body.categories;
      } else if (typeof req.body.categories === 'string') {
        categoryIds = req.body.categories.split(',').map((id: string) => id.trim()).filter((id: string) => id);
      }
    }

    // Generate unique slug from title
    const existingGames = await Game.find({}, 'slug');
    const existingSlugs = existingGames.map(g => g.slug).filter(Boolean);
    const slug = generateUniqueSlug(req.body.title, existingSlugs);

    const gameData: any = {
      title: req.body.title,
      slug: slug,
      description: req.body.description,
      iconPath: files.icon[0].path,
      zipFilePath: actualBuildPath,
      extractPath: extractPath
    };

    if (categoryIds.length > 0) {
      gameData.categories = categoryIds.map(id => new mongoose.Types.ObjectId(id));
    }

    const game = new Game(gameData);
    await game.save();
    await game.populate('categories');
    res.status(201).json(game);
  } catch (error: any) {
    // Clean up uploaded files and extracted folder on error
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Clean up icon file
    if (files.icon && files.icon[0] && fs.existsSync(files.icon[0].path)) {
      try {
        fs.unlinkSync(files.icon[0].path);
      } catch (cleanupError) {
        console.error('Error cleaning up icon file:', cleanupError);
      }
    }
    
    // Clean up zip file (if not already deleted)
    if (files.zipFile && files.zipFile[0] && fs.existsSync(files.zipFile[0].path)) {
      try {
        fs.unlinkSync(files.zipFile[0].path);
      } catch (cleanupError) {
        console.error('Error cleaning up zip file:', cleanupError);
      }
    }
    
    // Clean up extracted folder if it exists
    if (extractPath && fs.existsSync(extractPath)) {
      try {
        fs.rmSync(extractPath, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up extracted folder:', cleanupError);
      }
    }

    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000 || error.code === 11001) {
      return res.status(400).json({ error: 'A game with this title already exists. Please use a different title.' });
    }
    
    res.status(400).json({ error: error.message || 'Failed to create game' });
  }
});

// Get single game by slug or ID (for backward compatibility)
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    
    // Try to find by slug first, then by ID for backward compatibility
    let game = await Game.findOne({ slug: identifier }).populate('categories');
    
    // If not found by slug and identifier looks like MongoDB ObjectId, try by ID
    if (!game && mongoose.Types.ObjectId.isValid(identifier)) {
      game = await Game.findById(identifier).populate('categories');
    }
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Update game
router.put('/:id', upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'zipFile', maxCount: 1 }
]), async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let newExtractPath: string | null = null;
  let oldExtractPath: string | null = null;
  let oldIconPath: string | null = null;

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Store old paths for cleanup
    oldExtractPath = game.extractPath;
    oldIconPath = game.iconPath;

    // Check if title is being changed and if new title already exists
    if (req.body.title && req.body.title.trim() !== game.title) {
      const existingGame = await Game.findOne({ 
        title: req.body.title.trim(),
        _id: { $ne: req.params.id } // Exclude current game
      });
      if (existingGame) {
        // Clean up new uploaded files if title is duplicate
        if (files.icon && files.icon[0] && fs.existsSync(files.icon[0].path)) {
          fs.unlinkSync(files.icon[0].path);
        }
        if (files.zipFile && files.zipFile[0] && fs.existsSync(files.zipFile[0].path)) {
          fs.unlinkSync(files.zipFile[0].path);
        }
        return res.status(400).json({ error: 'A game with this title already exists. Please use a different title.' });
      }
    }

    // Handle new zip file upload
    if (files.zipFile && files.zipFile[0]) {
      const zipFile = files.zipFile[0];
      const uniqueId = uuidv4().substring(0, 8);
      const title = (req.body.title || game.title)?.replace(/[^a-zA-Z0-9]/g, '_') || 'game';
      newExtractPath = `src/uploads/gameBuilds/${title}_${uniqueId}`;

      // Extract zip file
      const zip = new AdmZip(zipFile.path);
      zip.extractAllTo(newExtractPath, true);

      // Find the actual build folder
      const findBuildPath = (dir: string): string => {
        const items = fs.readdirSync(dir);
        if (items.includes('index.html')) {
          return dir;
        }
        for (const item of items) {
          const itemPath = path.join(dir, item);
          if (fs.statSync(itemPath).isDirectory()) {
            const buildPath = findBuildPath(itemPath);
            if (buildPath) return buildPath;
          }
        }
        return dir;
      };

      const actualBuildPath = findBuildPath(newExtractPath);
      game.zipFilePath = actualBuildPath;
      game.extractPath = newExtractPath;

      // Remove the zip file after extraction
      fs.unlinkSync(zipFile.path);
    }

    // Handle new icon upload
    if (files.icon && files.icon[0]) {
      game.iconPath = files.icon[0].path;
    }

    // Update title and description
    if (req.body.title) {
      const newTitle = req.body.title.trim();
      const oldTitle = game.title;
      game.title = newTitle;
      
      // Regenerate slug if title changed
      if (newTitle !== oldTitle) {
        const existingGames = await Game.find({ _id: { $ne: req.params.id } }, 'slug');
        const existingSlugs = existingGames.map(g => g.slug).filter(Boolean);
        game.slug = generateUniqueSlug(newTitle, existingSlugs);
      }
    }
    if (req.body.description) {
      game.description = req.body.description.trim();
    }

    // Parse categories from request body
    if (req.body.categories !== undefined) {
      let categoryIds: string[] = [];
      if (req.body.categories) {
        if (Array.isArray(req.body.categories)) {
          categoryIds = req.body.categories;
        } else if (typeof req.body.categories === 'string' && req.body.categories.trim()) {
          categoryIds = req.body.categories.split(',').map((id: string) => id.trim()).filter((id: string) => id);
        }
      }
      game.categories = categoryIds.length > 0 
        ? categoryIds.map(id => new mongoose.Types.ObjectId(id))
        : [];
    }

    await game.save();
    await game.populate('categories');

    // Delete old files after successful update (only if new files were uploaded)
    if (newExtractPath && oldExtractPath && fs.existsSync(oldExtractPath)) {
      try {
        fs.rmSync(oldExtractPath, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up old extract path:', cleanupError);
      }
    }

    if (files.icon && files.icon[0] && oldIconPath && fs.existsSync(oldIconPath)) {
      try {
        fs.unlinkSync(oldIconPath);
      } catch (cleanupError) {
        console.error('Error cleaning up old icon:', cleanupError);
      }
    }

    res.json(game);
  } catch (error: any) {
    // Clean up new uploaded files on error
    if (files.icon && files.icon[0] && fs.existsSync(files.icon[0].path)) {
      try {
        fs.unlinkSync(files.icon[0].path);
      } catch (cleanupError) {
        console.error('Error cleaning up icon file:', cleanupError);
      }
    }
    if (files.zipFile && files.zipFile[0] && fs.existsSync(files.zipFile[0].path)) {
      try {
        fs.unlinkSync(files.zipFile[0].path);
      } catch (cleanupError) {
        console.error('Error cleaning up zip file:', cleanupError);
      }
    }
    if (newExtractPath && fs.existsSync(newExtractPath)) {
      try {
        fs.rmSync(newExtractPath, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up new extract path:', cleanupError);
      }
    }

    // Handle duplicate key error
    if (error.code === 11000 || error.code === 11001) {
      return res.status(400).json({ error: 'A game with this title already exists. Please use a different title.' });
    }

    res.status(400).json({ error: error.message || 'Failed to update game' });
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