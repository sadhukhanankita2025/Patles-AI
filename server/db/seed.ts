import dotenv from 'dotenv';
dotenv.config();

import { authService } from '../services/authService.js';
import { requireDatabase } from './database.js';

async function main() {
  console.log('🌱 Starting database migration & seed script...');
  try {
    await authService.initialize();
    console.log('✅ Database schema verified and seed data initialized.');
    console.log('--------------------------------------------------');
    console.log('Default Seed Credentials:');
    console.log('Email:    testuser@example.com');
    console.log('Password: Password123!');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing database seed:', error);
    process.exit(1);
  }
}

main();
