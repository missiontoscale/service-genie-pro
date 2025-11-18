# Social Media Scrapers

A comprehensive OOP-based social media scraping library for Reddit and Bluesky with batch keyword support.

## Features

- **Object-Oriented Design**: Clean, extensible architecture with base classes and platform-specific implementations
- **Batch Keyword Processing**: Scrape multiple keywords in a single operation
- **Multi-Platform Support**: Currently supports Reddit and Bluesky
- **Flexible Configuration**: Customizable sorting, time ranges, and result limits
- **Multiple Export Formats**: Export data as JSON or CSV
- **Rate Limiting**: Built-in rate limiting and retry logic
- **Statistics**: Comprehensive analytics on scraped data

## Architecture

```
BaseScraper (Abstract)
├── RedditScraper
└── BlueskyScraper

ScraperManager (Orchestrator)
```

### Classes

#### `BaseScraper`
Abstract base class that defines the common interface and functionality for all scrapers.

#### `RedditScraper`
Scrapes Reddit using the public JSON API. Supports:
- Keyword search across all subreddits
- Specific subreddit searches
- Customizable sorting and time ranges

#### `BlueskyScraper`
Scrapes Bluesky using the AT Protocol API. Supports:
- Keyword search
- Hashtag search
- User post scraping

#### `ScraperManager`
Manages multiple scrapers and handles batch operations across platforms.

## Installation

No additional dependencies required beyond the project's existing packages.

## Usage

### Simple Example

```typescript
import { ScraperManager } from './src/scrapers';

const manager = new ScraperManager(
  ['artificial intelligence', 'machine learning'],
  {
    maxResults: 50,
    sortBy: 'relevance',
    timeRange: 'week',
    platforms: ['reddit', 'bluesky']
  }
);

await manager.scrapeAll();
manager.printSummary();
```

### Using Individual Scrapers

```typescript
import { RedditScraper, BlueskyScraper } from './src/scrapers';

// Reddit scraper
const reddit = new RedditScraper(['typescript', 'nodejs'], {
  maxResults: 100,
  sortBy: 'top',
  timeRange: 'week'
});

await reddit.scrape();
const redditPosts = reddit.getResults();

// Search specific subreddits
await reddit.scrapeSubreddits(['programming', 'typescript']);

// Bluesky scraper
const bluesky = new BlueskyScraper(['javascript'], {
  maxResults: 50,
  sortBy: 'new'
});

await bluesky.scrape();
const blueskyPosts = bluesky.getResults();

// Search hashtag
await bluesky.scrapeHashtag('webdev');
```

### Adding Keywords Dynamically

```typescript
const manager = new ScraperManager(['python']);

// Add more keywords later
manager.addKeywords(['rust', 'golang']);
manager.addKeywords('java'); // Single keyword also works

await manager.scrapeAll();
```

### Exporting Results

```typescript
// Export to JSON
const jsonData = manager.exportToJSON();
console.log(jsonData);

// Export to CSV
const csvData = manager.exportToCSV();
console.log(csvData);

// Get statistics
const stats = manager.getStats();
console.log(stats);
```

### Filtering and Analysis

```typescript
const allResults = manager.getAllResults();

// Filter by score
const highScorePosts = allResults.filter(post => post.score > 100);

// Filter by platform
const redditPosts = allResults.filter(post => post.platform === 'Reddit');

// Filter by date
const recentPosts = allResults.filter(post =>
  post.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
);

// Get results by keyword
const byKeyword = manager.getResultsByKeyword();
byKeyword.forEach((posts, keyword) => {
  console.log(`${keyword}: ${posts.length} posts`);
});
```

## Configuration Options

### ScraperConfig

```typescript
{
  maxResults?: number;      // Maximum results per keyword (default: 100)
  sortBy?: 'relevance' | 'new' | 'top';  // Sort order (default: 'relevance')
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';  // Time range (default: 'week')
}
```

### ScraperManagerConfig

Extends `ScraperConfig` with:

```typescript
{
  platforms?: PlatformType[];  // ['reddit', 'bluesky', 'all'] (default: ['reddit', 'bluesky'])
  exportPath?: string;         // Optional export file path
}
```

## Data Structure

### ScrapedPost

```typescript
{
  id: string;              // Unique post ID
  author: string;          // Post author
  content: string;         // Post content/text
  url: string;            // Direct URL to post
  createdAt: Date;        // Post creation date
  score?: number;         // Upvotes/likes
  commentCount?: number;  // Number of comments
  platform: string;       // Platform name ('Reddit' or 'Bluesky')
  keyword: string;        // Keyword that matched this post
}
```

## Running Examples

Simple example:
```bash
npx tsx examples/simple-scraper.ts
```

Advanced example:
```bash
npx tsx examples/advanced-scraper.ts
```

## Rate Limiting

Both scrapers implement rate limiting to respect API limits:
- Reddit: 1 second delay between requests
- Bluesky: 500ms delay between requests
- Automatic retry with exponential backoff on failures
- Respects `Retry-After` headers

## Error Handling

All scrapers include comprehensive error handling:
- Network errors are caught and logged
- Failed requests are retried automatically
- Rate limiting is handled gracefully
- Individual keyword failures don't stop the entire batch

## Best Practices

1. **Start Small**: Begin with a small `maxResults` value to test
2. **Use Appropriate Time Ranges**: Smaller time ranges return more relevant results
3. **Monitor Rate Limits**: Be respectful of API rate limits
4. **Export Regularly**: Save results to avoid data loss
5. **Filter Results**: Use post-scraping filters to refine your dataset

## Extending

To add a new platform:

1. Create a new class extending `BaseScraper`
2. Implement the `scrape()` method
3. Implement the `getPlatformName()` method
4. Add it to `ScraperManager`'s initialization

Example:
```typescript
export class TwitterScraper extends BaseScraper {
  getPlatformName(): string {
    return 'Twitter';
  }

  async scrape(): Promise<ScrapedPost[]> {
    // Implementation
  }
}
```

## Limitations

- Reddit: Uses public API, no authentication required but rate limits apply
- Bluesky: Uses public API, some endpoints may require authentication in the future
- Both platforms may change their APIs without notice

## License

Part of the Service Genie Pro project.
