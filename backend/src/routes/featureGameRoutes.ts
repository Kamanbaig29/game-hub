import express from 'express';
import FeatureGame from '../models/FeatureGame.js';
import Game from '../models/Game.js';
import Tag from '../models/Tag.js';

const router = express.Router();

// Get all feature games with populated game data
router.get('/', async (req, res) => {
  try {
    const featureGames = await FeatureGame.find({})
      .populate('gameId')
      .populate('tagId')
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
      .populate('tagId')
      .sort({ position: 1 });
    
    // Filter out null gameIds (inactive games)
    const activeFeatureGames = featureGames.filter(fg => fg.gameId !== null);
    
    // Check if section should be hidden (if any feature game has hideSection: true)
    const isSectionHidden = activeFeatureGames.some(fg => fg.hideSection === true);
    
    // If section is hidden, return empty array
    if (isSectionHidden) {
      return res.json([]);
    }
    
    // Check if tags should be hidden globally
    const tag = await Tag.findOne({});
    const hideTags = tag?.hideSection === true;
    
    // Get all tags to check individual hideTag status
    const allTags = await Tag.find({});
    const hiddenTagIds = new Set(
      allTags.filter(t => t.hideTag === true).map(t => {
        const tagId = t._id as any;
        return String(tagId);
      })
    );
    
    // If tags are hidden globally, set tagId to null for all feature games
    // Otherwise, set tagId to null only for hidden individual tags
    const result = activeFeatureGames.map(fg => {
      const fgObj = fg.toObject();
      
      if (hideTags) {
        // Global hide: hide all tags
        return {
          ...fgObj,
          tagId: null
        };
      } else if (fgObj.tagId && hiddenTagIds.has(fgObj.tagId._id?.toString() || fgObj.tagId.toString())) {
        // Individual tag hide: hide only this specific tag
        return {
          ...fgObj,
          tagId: null
        };
      }
      return fgObj;
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active feature games' });
  }
});

// Create or update feature game
router.post('/', async (req, res) => {
  try {
    const { gameId, tagId, position } = req.body;

    if (!gameId || !position) {
      return res.status(400).json({ error: 'gameId and position are required' });
    }

    if (position < 1) {
      return res.status(400).json({ error: 'Position must be at least 1' });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if tag exists (only if tagId is provided)
    if (tagId) {
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
    }

    // Check if position is already taken
    const existingFeature = await FeatureGame.findOne({ position });
    
    // If _id is provided, we're updating an existing feature game
    if (req.body._id) {
      // If position is taken by a different feature game, reject
      if (existingFeature && String(existingFeature._id) !== req.body._id) {
        return res.status(400).json({ error: `Position ${position} is already taken` });
      }
      
      // Update existing feature game
      const updateData: any = { gameId, position };
      if (tagId) {
        updateData.tagId = tagId;
      } else {
        updateData.tagId = null;
      }
      const featureGame = await FeatureGame.findByIdAndUpdate(
        req.body._id,
        updateData,
        { new: true, runValidators: true }
      ).populate('gameId').populate('tagId');
      
      if (!featureGame) {
        return res.status(404).json({ error: 'Feature game not found' });
      }
      return res.json(featureGame);
    }

    // Creating new feature game - check if position is already taken
    if (existingFeature) {
      return res.status(400).json({ error: `Position ${position} is already taken` });
    }

    // Create new feature game
    const featureGameData: any = { gameId, position };
    if (tagId) {
      featureGameData.tagId = tagId;
    }
    const featureGame = new FeatureGame(featureGameData);
    await featureGame.save();
    await featureGame.populate('gameId');
    await featureGame.populate('tagId');
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
    const { gameId, tagId, position } = req.body;

    if (!gameId || !position) {
      return res.status(400).json({ error: 'gameId and position are required' });
    }

    if (position < 1) {
      return res.status(400).json({ error: 'Position must be at least 1' });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if tag exists (only if tagId is provided)
    if (tagId) {
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
    }

    // Check if position is already taken by another feature game
    const existingFeature = await FeatureGame.findOne({ position });
    if (existingFeature && String(existingFeature._id) !== req.params.id) {
      return res.status(400).json({ error: `Position ${position} is already taken` });
    }

    const updateData: any = { gameId, position };
    if (tagId) {
      updateData.tagId = tagId;
    } else {
      updateData.tagId = null;
    }
    const featureGame = await FeatureGame.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('gameId').populate('tagId');

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
    if (position < 1) {
      return res.status(400).json({ error: 'Position must be at least 1' });
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

// Toggle hide section for all feature games
router.post('/toggle-hide-section', async (req, res) => {
  try {
    const { hideSection } = req.body;
    
    if (typeof hideSection !== 'boolean') {
      return res.status(400).json({ error: 'hideSection must be a boolean' });
    }

    // Update all feature games with the hideSection value
    const result = await FeatureGame.updateMany({}, { hideSection });
    
    res.json({ 
      message: `Feature section ${hideSection ? 'hidden' : 'shown'}`,
      hideSection,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hide section' });
  }
});

// Get hide section status
router.get('/hide-section-status', async (req, res) => {
  try {
    const featureGame = await FeatureGame.findOne({});
    const hideSection = featureGame?.hideSection || false;
    res.json({ hideSection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hide section status' });
  }
});

export default router;

