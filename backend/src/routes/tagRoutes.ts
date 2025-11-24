import express from 'express';
import Tag from '../models/Tag.js';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find({}).sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get hide section status (MUST come before /:id route)
router.get('/hide-section-status', async (req, res) => {
  try {
    const tag = await Tag.findOne({});
    const hideSection = tag?.hideSection || false;
    res.json({ hideSection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hide section status' });
  }
});

// Get single tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// Create new tag
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    // Validate color format if provided
    if (color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return res.status(400).json({ error: 'Invalid color format. Use hex color (e.g., #9945ff)' });
    }

    const tag = new Tag({
      name: name.toLowerCase().trim(),
      color: color || '#9945ff'
    });

    await tag.save();
    res.status(201).json(tag);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tag name already exists' });
    }
    res.status(400).json({ error: 'Failed to create tag', details: error.message });
  }
});

// Update tag
router.put('/:id', async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    // Validate color format if provided
    if (color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return res.status(400).json({ error: 'Invalid color format. Use hex color (e.g., #9945ff)' });
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      {
        name: name.toLowerCase().trim(),
        ...(color && { color })
      },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Tag name already exists' });
    }
    res.status(400).json({ error: 'Failed to update tag', details: error.message });
  }
});

// Delete tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

// Toggle hide tags from feature section
router.post('/toggle-hide-section', async (req, res) => {
  try {
    const { hideSection } = req.body;
    
    if (typeof hideSection !== 'boolean') {
      return res.status(400).json({ error: 'hideSection must be a boolean' });
    }

    // Update all tags with the hideSection value
    const result = await Tag.updateMany({}, { hideSection });
    
    res.json({ 
      message: `Tags ${hideSection ? 'hidden' : 'shown'} from feature section`,
      hideSection,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hide tags' });
  }
});

// Toggle hide individual tag
router.put('/:id/toggle-hide', async (req, res) => {
  try {
    const { hideTag } = req.body;
    
    if (typeof hideTag !== 'boolean') {
      return res.status(400).json({ error: 'hideTag must be a boolean' });
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { hideTag },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ 
      message: `Tag ${hideTag ? 'hidden' : 'shown'}`,
      tag
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hide tag' });
  }
});

export default router;

