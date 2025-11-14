import express, { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

interface AuthRequest extends Request {
  adminId?: string;
  admin?: any;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { adminId: string };
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireSuperAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.role !== 'super-admin') {
      return res.status(403).json({ message: 'Super admin access required' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};