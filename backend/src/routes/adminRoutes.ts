import express, { type Request } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { authenticateAdmin, requireSuperAdmin } from '../middleware/auth.js';

interface AuthRequest extends Request {
  adminId?: string;
}

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin || !(await admin.comparePassword(password))) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin profile
router.get('/profile', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const admin = await Admin.findById(req.adminId, '-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all admins (super-admin only)
router.get('/users', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin (super-admin only)
router.post('/create', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ username, password, role });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete admin (super-admin only)
router.delete('/users/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    if (admin.role === 'super-admin') {
      return res.status(400).json({ message: 'Cannot delete super-admin' });
    }
    
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;