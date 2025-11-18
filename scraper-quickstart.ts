#!/usr/bin/env tsx
/**
 * Social Media Scraper - Quick Start Script
 *
 * Usage:
 *   npx tsx scraper-quickstart.ts
 *
 * This script provides an interactive way to scrape Reddit and Bluesky
 * with batch keyword support.
 */

import { ScraperManager } from './src/scrapers';
import { writeFileSync } from 'fs';

// Configuration
const config = {
  // Enter your keywords here (batch)
  keywords: [
    'artificial intelligence',
    'web development',
    'typescript',
  ],

  // Scraper settings
  settings: {
    maxResults: 25,           // Results per keyword per platform
    sortBy: 'relevance' as const,  // 'relevance' | 'new' | 'top'
    timeRange: 'week' as const,    // 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
    platforms: ['reddit', 'bluesky'] as const,  // Platforms to scrape
  },

  // Export settings
  export: {
    saveToFile: true,
    jsonPath: 'scraper-results.json',
    csvPath: 'scraper-results.csv',
  },
};

async function main() {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     SOCIAL MEDIA SCRAPER - Quick Start                   ║');
  console.log('║     Reddit & Bluesky Batch Keyword Scraper                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('Configuration:');
  console.log('─'.repeat(60));
  console.log(`Keywords: ${config.keywords.map(k => `"${k}"`).join(', ')}`);
  console.log(`Max Results: ${config.settings.maxResults} per keyword per platform`);
  console.log(`Sort By: ${config.settings.sortBy}`);
  console.log(`Time Range: ${config.settings.timeRange}`);
  console.log(`Platforms: ${config.settings.platforms.join(', ')}`);
  console.log('─'.repeat(60));
  console.log('\nStarting scrape in 2 seconds...\n');

  await sleep(2000);

  try {
    // Create scraper manager
    const manager = new ScraperManager(config.keywords, config.settings);

    // Start scraping (parallel for better performance)
    console.log('🚀 Scraping started...\n');
    const startTime = Date.now();

    await manager.scrapeAllParallel();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Scraping completed in ${duration} seconds\n`);

    // Display summary
    manager.printSummary();

    // Get detailed results
    const allResults = manager.getAllResults();
    const byKeyword = manager.getResultsByKeyword();
    const byPlatform = manager.getResultsByPlatform();

    // Display sample results
    console.log('\n📝 Sample Results:');
    console.log('─'.repeat(60));

    byKeyword.forEach((posts, keyword) => {
      console.log(`\n"${keyword}" (${posts.length} posts):`);
      posts.slice(0, 2).forEach((post, idx) => {
        console.log(`\n  ${idx + 1}. [${post.platform}] by ${post.author}`);
        console.log(`     ${post.content.substring(0, 150)}...`);
        console.log(`     URL: ${post.url}`);
        console.log(`     Score: ${post.score || 0} | Comments: ${post.commentCount || 0}`);
      });
    });

    // Export results
    if (config.export.saveToFile) {
      console.log('\n💾 Exporting results...');
      console.log('─'.repeat(60));

      // Export to JSON
      const jsonData = manager.exportToJSON();
      writeFileSync(config.export.jsonPath, jsonData);
      console.log(`✓ JSON saved to: ${config.export.jsonPath}`);

      // Export to CSV
      const csvData = manager.exportToCSV();
      writeFileSync(config.export.csvPath, csvData);
      console.log(`✓ CSV saved to: ${config.export.csvPath}`);
    }

    // Display analytics
    console.log('\n📊 Analytics:');
    console.log('─'.repeat(60));

    // Top posts by score
    const topPosts = allResults
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);

    console.log('\nTop 5 Posts by Score:');
    topPosts.forEach((post, idx) => {
      console.log(`  ${idx + 1}. [${post.platform}] ${post.author} - Score: ${post.score}`);
      console.log(`     "${post.content.substring(0, 80)}..."`);
    });

    // Posts by platform distribution
    console.log('\nPlatform Distribution:');
    byPlatform.forEach((posts, platform) => {
      const percentage = ((posts.length / allResults.length) * 100).toFixed(1);
      console.log(`  ${platform}: ${posts.length} (${percentage}%)`);
    });

    // Average engagement
    const avgScore = allResults.reduce((sum, p) => sum + (p.score || 0), 0) / allResults.length;
    const avgComments = allResults.reduce((sum, p) => sum + (p.commentCount || 0), 0) / allResults.length;
    console.log(`\nAverage Score: ${avgScore.toFixed(2)}`);
    console.log(`Average Comments: ${avgComments.toFixed(2)}`);

    // Recency
    const now = Date.now();
    const last24h = allResults.filter(p => now - p.createdAt.getTime() < 24 * 60 * 60 * 1000);
    console.log(`Posts from last 24h: ${last24h.length} (${((last24h.length / allResults.length) * 100).toFixed(1)}%)`);

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 All done! Check the exported files for full results.');
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error during scraping:', error);
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
