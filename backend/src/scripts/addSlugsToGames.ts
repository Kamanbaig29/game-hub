import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Game from '../models/Game.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';

dotenv.config();

const addSlugsToGames = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to GameHub database');
    
    // Find all games
    const games = await Game.find({});
    console.log(`Found ${games.length} games`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const game of games) {
      // Skip if game already has a slug
      if (game.slug) {
        console.log(`Skipping "${game.title}" - already has slug: ${game.slug}`);
        skippedCount++;
        continue;
      }
      
      // Get all existing slugs to ensure uniqueness
      const allGames = await Game.find({}, 'slug');
      const existingSlugs = allGames
        .map(g => g.slug)
        .filter(Boolean)
        .filter(slug => slug !== game.slug); // Exclude current game's slug if it exists
      
      // Generate unique slug
      const slug = generateUniqueSlug(game.title, existingSlugs);
      
      // Update game with slug
      game.slug = slug;
      await game.save();
      
      console.log(`Updated "${game.title}" with slug: ${slug}`);
      updatedCount++;
    }
    
    console.log('\nMigration completed!');
    console.log(`Updated: ${updatedCount} games`);
    console.log(`Skipped: ${skippedCount} games`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error adding slugs to games:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

addSlugsToGames();

