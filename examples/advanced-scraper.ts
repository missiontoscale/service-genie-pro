/**
 * Advanced Social Media Scraper Example
 *
 * This example demonstrates advanced usage including:
 * - Individual platform scrapers
 * - Adding keywords dynamically
 * - CSV export
 * - Platform-specific features
 */

import { RedditScraper, BlueskyScraper, ScraperManager } from '../src/scrapers';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function individualScraperExample() {
  console.log('\n=== INDIVIDUAL SCRAPER EXAMPLE ===\n');

  // Use Reddit scraper individually
  const redditScraper = new RedditScraper(['nodejs', 'deno'], {
    maxResults: 30,
    sortBy: 'top',
    timeRange: 'week',
  });

  console.log('Scraping Reddit...');
  await redditScraper.scrape();

  const redditStats = redditScraper.getStats();
  console.log('Reddit Stats:', redditStats);

  // Search specific subreddits
  console.log('\nSearching specific subreddits...');
  await redditScraper.scrapeSubreddits(['programming', 'typescript']);
  console.log(`Total Reddit posts: ${redditScraper.getResults().length}`);

  // Use Bluesky scraper individually
  const blueskyScraper = new BlueskyScraper(['javascript'], {
    maxResults: 20,
    sortBy: 'new',
  });

  console.log('\nScraping Bluesky...');
  await blueskyScraper.scrape();

  const blueskyStats = blueskyScraper.getStats();
  console.log('Bluesky Stats:', blueskyStats);

  // Search hashtag
  console.log('\nSearching Bluesky hashtag...');
  const hashtagPosts = await blueskyScraper.scrapeHashtag('webdev');
  console.log(`Found ${hashtagPosts.length} posts with #webdev`);
}

async function dynamicKeywordsExample() {
  console.log('\n=== DYNAMIC KEYWORDS EXAMPLE ===\n');

  // Start with initial keywords
  const manager = new ScraperManager(['python'], {
    maxResults: 25,
    platforms: ['reddit'],
  });

  console.log('Initial keywords:', manager.getKeywords());

  // Add more keywords dynamically
  manager.addKeywords(['rust', 'golang']);
  console.log('Updated keywords:', manager.getKeywords());

  // Scrape with all keywords
  await manager.scrapeAll();
  manager.printSummary();
}

async function exportExample() {
  console.log('\n=== EXPORT EXAMPLE ===\n');

  const manager = new ScraperManager(['react', 'vue'], {
    maxResults: 20,
    platforms: ['reddit', 'bluesky'],
  });

  console.log('Scraping for export example...');
  await manager.scrapeAllParallel(); // Use parallel scraping

  // Export to JSON file
  const jsonData = manager.exportToJSON();
  const jsonPath = join(process.cwd(), 'scraper-results.json');
  writeFileSync(jsonPath, jsonData);
  console.log(`JSON results saved to: ${jsonPath}`);

  // Export to CSV file
  const csvData = manager.exportToCSV();
  const csvPath = join(process.cwd(), 'scraper-results.csv');
  writeFileSync(csvPath, csvData);
  console.log(`CSV results saved to: ${csvPath}`);

  // Get statistics
  const stats = manager.getStats();
  console.log('\nStatistics:', JSON.stringify(stats, null, 2));
}

async function filterAndAnalyzeExample() {
  console.log('\n=== FILTER AND ANALYZE EXAMPLE ===\n');

  const manager = new ScraperManager(['AI', 'ChatGPT'], {
    maxResults: 50,
    platforms: ['reddit', 'bluesky'],
    sortBy: 'top',
    timeRange: 'day',
  });

  await manager.scrapeAll();

  const allResults = manager.getAllResults();

  // Filter posts by score
  const highScorePosts = allResults.filter(post => (post.score || 0) > 100);
  console.log(`High score posts (>100): ${highScorePosts.length}`);

  // Filter by platform
  const redditPosts = allResults.filter(post => post.platform === 'Reddit');
  const blueskyPosts = allResults.filter(post => post.platform === 'Bluesky');
  console.log(`Reddit posts: ${redditPosts.length}`);
  console.log(`Bluesky posts: ${blueskyPosts.length}`);

  // Find posts from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayPosts = allResults.filter(post => post.createdAt >= today);
  console.log(`Posts from today: ${todayPosts.length}`);

  // Get top authors
  const authorCounts = allResults.reduce((acc, post) => {
    acc[post.author] = (acc[post.author] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAuthors = Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  console.log('\nTop 5 authors:');
  topAuthors.forEach(([author, count]) => {
    console.log(`  ${author}: ${count} posts`);
  });

  // Average engagement per platform
  const platformEngagement = {
    Reddit: redditPosts.reduce((sum, p) => sum + (p.score || 0), 0) / redditPosts.length || 0,
    Bluesky: blueskyPosts.reduce((sum, p) => sum + (p.score || 0), 0) / blueskyPosts.length || 0,
  };

  console.log('\nAverage engagement per platform:');
  console.log(`  Reddit: ${platformEngagement.Reddit.toFixed(2)}`);
  console.log(`  Bluesky: ${platformEngagement.Bluesky.toFixed(2)}`);
}

async function main() {
  console.log('ADVANCED SOCIAL MEDIA SCRAPER EXAMPLES');
  console.log('=' .repeat(60));

  try {
    // Run all examples
    await individualScraperExample();
    await dynamicKeywordsExample();
    await exportExample();
    await filterAndAnalyzeExample();

    console.log('\n' + '='.repeat(60));
    console.log('All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

main();
