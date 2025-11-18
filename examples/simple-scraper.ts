/**
 * Simple Social Media Scraper Example
 *
 * This example demonstrates basic usage of the scraper with batch keywords
 */

import { ScraperManager } from '../src/scrapers';

async function main() {
  // Define batch keywords to search for
  const keywords = [
    'artificial intelligence',
    'machine learning',
    'typescript',
  ];

  // Create scraper manager with configuration
  const manager = new ScraperManager(keywords, {
    maxResults: 50, // Max results per keyword per platform
    sortBy: 'relevance',
    timeRange: 'week',
    platforms: ['reddit', 'bluesky'], // Or use 'all' for all platforms
  });

  console.log('Starting scrape...\n');

  // Scrape all platforms
  await manager.scrapeAll();

  // Print summary
  manager.printSummary();

  // Export results to JSON
  const json = manager.exportToJSON();
  console.log('\nJSON export preview (first 500 chars):');
  console.log(json.substring(0, 500) + '...\n');

  // Get results by keyword
  const resultsByKeyword = manager.getResultsByKeyword();
  console.log('\nResults by keyword:');
  resultsByKeyword.forEach((posts, keyword) => {
    console.log(`\n"${keyword}" - ${posts.length} posts:`);
    posts.slice(0, 3).forEach(post => {
      console.log(`  - [${post.platform}] ${post.author}: ${post.content.substring(0, 100)}...`);
    });
  });
}

main().catch(console.error);
