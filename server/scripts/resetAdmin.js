import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('No admin found. Creating new admin...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        bio: 'Markiit Platform Administrator',
      });
      console.log(`Admin created: ${newAdmin.email}`);
    } else {
      console.log(`Found admin: ${admin.email} (id: ${admin._id})`);
      admin.email = process.env.ADMIN_EMAIL;
      admin.password = process.env.ADMIN_PASSWORD;
      await admin.save();
      console.log(`Admin updated to: ${admin.email}`);
    }

    const testUser = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');
    if (testUser) {
      const match = await testUser.matchPassword(process.env.ADMIN_PASSWORD);
      console.log(`Password test: ${match ? 'PASS' : 'FAIL'}`);
      console.log(`Role: ${testUser.role}`);
    } else {
      console.log('ERROR: Could not find admin user after update!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();
