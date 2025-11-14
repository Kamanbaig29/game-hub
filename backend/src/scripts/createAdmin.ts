import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/database.js';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to GameHub database');
    
    const username = '';
    const password = '';
    
    console.log('Checking for existing admin...');
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('Admin already exists');
      await mongoose.disconnect();
      process.exit(0);
    }
    
    console.log('Creating new admin...');
    const admin = new Admin({ username, password, role: 'super-admin' });
    const savedAdmin = await admin.save();
    
    console.log('Admin created successfully');
    console.log('Saved admin:', savedAdmin);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();