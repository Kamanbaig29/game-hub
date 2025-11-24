import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories (for admin - includes hidden)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get active categories (for frontend - filters hidden)
router.get('/active', async (req, res) => {
  try {
    // Check if section should be hidden
    const anyCategory = await Category.findOne({});
    const hideSection = anyCategory?.hideSection === true;
    
    // If section is hidden, return empty array
    if (hideSection) {
      return res.json([]);
    }
    
    // Get all categories and filter out hidden individual categories
    const categories = await Category.find({ hideCategory: { $ne: true } })
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active categories' });
  }
});

// Get hide section status (MUST come before /:id route)
router.get('/hide-section-status', async (req, res) => {
  try {
    const category = await Category.findOne({});
    const hideSection = category?.hideSection || false;
    res.json({ hideSection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hide section status' });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || ''
    });

    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(400).json({ error: 'Failed to create category', details: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        ...(description !== undefined && { description: description.trim() })
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(400).json({ error: 'Failed to update category', details: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Toggle hide section for all categories
router.post('/toggle-hide-section', async (req, res) => {
  try {
    const { hideSection } = req.body;
    
    if (typeof hideSection !== 'boolean') {
      return res.status(400).json({ error: 'hideSection must be a boolean' });
    }

    // Update all categories with the hideSection value
    const result = await Category.updateMany({}, { hideSection });
    
    res.json({ 
      message: `Categories section ${hideSection ? 'hidden' : 'shown'}`,
      hideSection,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hide section' });
  }
});

// Toggle hide individual category
router.put('/:id/toggle-hide', async (req, res) => {
  try {
    const { hideCategory } = req.body;
    
    if (typeof hideCategory !== 'boolean') {
      return res.status(400).json({ error: 'hideCategory must be a boolean' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { hideCategory },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ 
      message: `Category ${hideCategory ? 'hidden' : 'shown'}`,
      category
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle hide category' });
  }
});

export default router;

