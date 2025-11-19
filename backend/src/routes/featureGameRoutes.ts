import express from 'express';
import FeatureGame from '../models/FeatureGame.js';
import Game from '../models/Game.js';

const router = express.Router();

// Get all feature games with populated game data
router.get('/', async (req, res) => {
  try {
    const featureGames = await FeatureGame.find({})
      .populate('gameId')
      .sort({ position: 1 });
    res.json(featureGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature games' });
  }
});

// Get active feature games only (games that are active)
router.get('/active', async (req, res) => {
  try {
    const featureGames = await FeatureGame.find({})
      .populate({
        path: 'gameId',
        match: { isActive: true }
      })
      .sort({ position: 1 });
    
    // Filter out null gameIds (inactive games)
    const activeFeatureGames = featureGames.filter(fg => fg.gameId !== null);
    res.json(activeFeatureGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active feature games' });
  }
});

// Create or update feature game
router.post('/', async (req, res) => {
  try {
    const { gameId, tag, position } = req.body;

    if (!gameId || !tag || !position) {
      return res.status(400).json({ error: 'gameId, tag, and position are required' });
    }

    if (!['hot', 'new', 'trending', 'updated'].includes(tag)) {
      return res.status(400).json({ error: 'Tag must be hot, new, trending, or updated' });
    }

    if (position < 1 || position > 6) {
      return res.status(400).json({ error: 'Position must be between 1 and 6' });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if position is already taken
    const existingFeature = await FeatureGame.findOne({ position });
    if (existingFeature && req.body._id && String(existingFeature._id) !== req.body._id) {
      return res.status(400).json({ error: `Position ${position} is already taken` });
    }

    // If _id is provided, update existing feature game
    if (req.body._id) {
      const featureGame = await FeatureGame.findByIdAndUpdate(
        req.body._id,
        { gameId, tag, position },
        { new: true, runValidators: true }
      ).populate('gameId');
      
      if (!featureGame) {
        return res.status(404).json({ error: 'Feature game not found' });
      }
      return res.json(featureGame);
    }

    // Create new feature game
    const featureGame = new FeatureGame({ gameId, tag, position });
    await featureGame.save();
    await featureGame.populate('gameId');
    res.status(201).json(featureGame);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Position is already taken' });
    }
    res.status(400).json({ error: 'Failed to create feature game', details: error.message });
  }
});

// Update feature game
router.put('/:id', async (req, res) => {
  try {
    const { gameId, tag, position } = req.body;

    if (!gameId || !tag || !position) {
      return res.status(400).json({ error: 'gameId, tag, and position are required' });
    }

    if (!['hot', 'new', 'trending', 'updated'].includes(tag)) {
      return res.status(400).json({ error: 'Tag must be hot, new, trending, or updated' });
    }

    if (position < 1 || position > 6) {
      return res.status(400).json({ error: 'Position must be between 1 and 6' });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if position is already taken by another feature game
    const existingFeature = await FeatureGame.findOne({ position });
    if (existingFeature && String(existingFeature._id) !== req.params.id) {
      return res.status(400).json({ error: `Position ${position} is already taken` });
    }

    const featureGame = await FeatureGame.findByIdAndUpdate(
      req.params.id,
      { gameId, tag, position },
      { new: true, runValidators: true }
    ).populate('gameId');

    if (!featureGame) {
      return res.status(404).json({ error: 'Feature game not found' });
    }

    res.json(featureGame);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Position is already taken' });
    }
    res.status(400).json({ error: 'Failed to update feature game', details: error.message });
  }
});

// Delete feature game
router.delete('/:id', async (req, res) => {
  try {
    const featureGame = await FeatureGame.findByIdAndDelete(req.params.id);
    if (!featureGame) {
      return res.status(404).json({ error: 'Feature game not found' });
    }
    res.json({ message: 'Feature game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feature game' });
  }
});

// Delete feature game by position
router.delete('/position/:position', async (req, res) => {
  try {
    const position = parseInt(req.params.position);
    if (position < 1 || position > 6) {
      return res.status(400).json({ error: 'Position must be between 1 and 6' });
    }
    const featureGame = await FeatureGame.findOneAndDelete({ position });
    if (!featureGame) {
      return res.status(404).json({ error: 'Feature game not found at this position' });
    }
    res.json({ message: 'Feature game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feature game' });
  }
});

export default router;

