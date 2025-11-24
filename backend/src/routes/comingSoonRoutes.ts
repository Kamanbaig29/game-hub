import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ComingSoon from '../models/ComingSoon.js';

const router = express.Router();

// Configure multer for icon uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/comingSoon');
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4().substring(0, 8);
    const name = req.body.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'coming-soon';
    const ext = path.extname(file.originalname);
    cb(null, `${name}_${uniqueId}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all coming soon games
router.get('/', async (req, res) => {
  try {
    const comingSoon = await ComingSoon.find({}).sort({ createdAt: -1 });
    res.json(comingSoon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coming soon games' });
  }
});

// Get single coming soon game by ID
router.get('/:id', async (req, res) => {
  try {
    const comingSoon = await ComingSoon.findById(req.params.id);
    if (!comingSoon) {
      return res.status(404).json({ error: 'Coming soon game not found' });
    }
    res.json(comingSoon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coming soon game' });
  }
});

// Create new coming soon game
router.post('/', upload.single('icon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Icon file is required' });
    }

    if (!req.body.name || !req.body.name.trim()) {
      // Clean up uploaded file if name is missing
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Game name is required' });
    }

    const comingSoon = new ComingSoon({
      name: req.body.name.trim(),
      description: req.body.description ? req.body.description.trim() : '',
      iconPath: req.file.path
    });

    await comingSoon.save();
    res.status(201).json(comingSoon);
  } catch (error: any) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up icon file:', cleanupError);
      }
    }
    res.status(400).json({ error: error.message || 'Failed to create coming soon game' });
  }
});

// Update coming soon game
router.put('/:id', upload.single('icon'), async (req, res) => {
  let oldIconPath: string | null = null;

  try {
    const comingSoon = await ComingSoon.findById(req.params.id);
    if (!comingSoon) {
      // Clean up new uploaded file if game not found
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Coming soon game not found' });
    }

    oldIconPath = comingSoon.iconPath;

    // Update name if provided
    if (req.body.name && req.body.name.trim()) {
      comingSoon.name = req.body.name.trim();
    }

    // Update description if provided
    if (req.body.description !== undefined) {
      comingSoon.description = req.body.description ? req.body.description.trim() : '';
    }

    // Update icon if new file uploaded
    if (req.file) {
      comingSoon.iconPath = req.file.path;
    }

    await comingSoon.save();

    // Delete old icon after successful update
    if (req.file && oldIconPath && fs.existsSync(oldIconPath)) {
      try {
        fs.unlinkSync(oldIconPath);
      } catch (cleanupError) {
        console.error('Error cleaning up old icon:', cleanupError);
      }
    }

    res.json(comingSoon);
  } catch (error: any) {
    // Clean up new uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up icon file:', cleanupError);
      }
    }
    res.status(400).json({ error: error.message || 'Failed to update coming soon game' });
  }
});

// Delete coming soon game
router.delete('/:id', async (req, res) => {
  try {
    const comingSoon = await ComingSoon.findById(req.params.id);
    if (!comingSoon) {
      return res.status(404).json({ error: 'Coming soon game not found' });
    }

    // Delete icon file
    if (fs.existsSync(comingSoon.iconPath)) {
      try {
        fs.unlinkSync(comingSoon.iconPath);
      } catch (error) {
        console.error('Error deleting icon file:', error);
      }
    }

    // Delete from database
    await ComingSoon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coming soon game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coming soon game' });
  }
});

export default router;

