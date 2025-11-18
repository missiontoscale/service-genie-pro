# Social Media Scraper Guide

A comprehensive OOP-based social media scraping tool for Reddit and Bluesky with batch keyword support.

## Quick Start

### Run the Quick Start Script

```bash
npm run scraper
```

This will scrape Reddit and Bluesky for the default keywords configured in `scraper-quickstart.ts`.

### Customize Your Search

Edit `scraper-quickstart.ts` to change:
- **Keywords**: Add your batch keywords to search for
- **Max Results**: Number of results per keyword per platform
- **Sort By**: How to sort results (relevance, new, top)
- **Time Range**: When to search (hour, day, week, month, year, all)
- **Platforms**: Which platforms to scrape (reddit, bluesky, or both)

```typescript
const config = {
  keywords: [
    'your keyword 1',
    'your keyword 2',
    'your keyword 3',
  ],
  settings: {
    maxResults: 25,
    sortBy: 'relevance',
    timeRange: 'week',
    platforms: ['reddit', 'bluesky'],
  },
};
```

## Features

- **OOP Architecture**: Clean, maintainable, and extensible code structure
- **Batch Keyword Processing**: Search multiple keywords at once
- **Multi-Platform Support**: Reddit and Bluesky (easy to extend)
- **Rate Limiting**: Automatic rate limiting and retry logic
- **Export Options**: JSON and CSV export formats
- **Rich Analytics**: Statistics and insights on scraped data
- **TypeScript**: Full type safety and IntelliSense support

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         ScraperManager                  │
│   (Orchestrates all scrapers)           │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│RedditScraper │    │BlueskyScraper│
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
          ┌─────────────┐
          │BaseScraper  │
          │ (Abstract)  │
          └─────────────┘
```

## File Structure

```
service-genie-pro/
├── src/scrapers/
│   ├── BaseScraper.ts       # Abstract base class
│   ├── RedditScraper.ts     # Reddit implementation
│   ├── BlueskyScraper.ts    # Bluesky implementation
│   ├── ScraperManager.ts    # Batch processor
│   ├── index.ts             # Exports
│   └── README.md            # Technical documentation
├── examples/
│   ├── simple-scraper.ts    # Simple usage example
│   └── advanced-scraper.ts  # Advanced features demo
├── scraper-quickstart.ts    # Main entry point
└── SCRAPER_GUIDE.md         # This file
```

## Usage Examples

### Example 1: Simple Usage

```typescript
import { ScraperManager } from './src/scrapers';

const manager = new ScraperManager(['AI', 'TypeScript'], {
  maxResults: 50,
  platforms: ['reddit', 'bluesky'],
});

await manager.scrapeAll();
manager.printSummary();
```

### Example 2: Individual Platform Scraper

```typescript
import { RedditScraper } from './src/scrapers';

const scraper = new RedditScraper(['python', 'rust'], {
  maxResults: 100,
  sortBy: 'top',
  timeRange: 'week',
});

await scraper.scrape();
const posts = scraper.getResults();
```

### Example 3: Export to Files

```typescript
import { ScraperManager } from './src/scrapers';
import { writeFileSync } from 'fs';

const manager = new ScraperManager(['react', 'vue']);
await manager.scrapeAll();

// Export to JSON
writeFileSync('results.json', manager.exportToJSON());

// Export to CSV
writeFileSync('results.csv', manager.exportToCSV());
```

### Example 4: Dynamic Keywords

```typescript
const manager = new ScraperManager(['javascript']);

// Add more keywords later
manager.addKeywords(['nodejs', 'deno', 'bun']);

await manager.scrapeAll();
```

### Example 5: Platform-Specific Features

```typescript
import { RedditScraper, BlueskyScraper } from './src/scrapers';

// Reddit: Search specific subreddits
const reddit = new RedditScraper(['typescript']);
await reddit.scrapeSubreddits(['programming', 'typescript']);

// Bluesky: Search hashtags
const bluesky = new BlueskyScraper(['']);
await bluesky.scrapeHashtag('webdev');

// Bluesky: Get user posts
await bluesky.scrapeUserPosts('username.bsky.social');
```

## Running Examples

### Quick Start Script
```bash
npm run scraper
```

### Simple Example
```bash
npm run scraper:simple
```

### Advanced Example
```bash
npm run scraper:advanced
```

### Custom Script
```bash
npx tsx your-script.ts
```

## Configuration Options

### ScraperConfig

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxResults` | number | 100 | Maximum results per keyword |
| `sortBy` | string | 'relevance' | Sort by: relevance, new, top |
| `timeRange` | string | 'week' | Time range: hour, day, week, month, year, all |

### ScraperManagerConfig

Extends `ScraperConfig` with:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `platforms` | array | ['reddit', 'bluesky'] | Platforms to scrape |
| `exportPath` | string | undefined | Optional export file path |

## Data Structure

Each scraped post includes:

```typescript
{
  id: string;              // Unique post ID
  author: string;          // Post author
  content: string;         // Post content/text
  url: string;             // Direct URL to post
  createdAt: Date;         // Post creation date
  score?: number;          // Upvotes/likes
  commentCount?: number;   // Number of comments
  platform: string;        // 'Reddit' or 'Bluesky'
  keyword: string;         // Matching keyword
}
```

## Advanced Features

### Filtering Results

```typescript
const results = manager.getAllResults();

// High engagement posts
const popular = results.filter(p => p.score > 100);

// Recent posts only
const recent = results.filter(p =>
  p.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
);

// Platform specific
const redditOnly = results.filter(p => p.platform === 'Reddit');
```

### Analytics

```typescript
const stats = manager.getStats();

console.log(stats);
// {
//   totalPosts: 150,
//   totalKeywords: 3,
//   platforms: ['reddit', 'bluesky'],
//   platformStats: { ... },
//   postsByKeyword: [ ... ],
//   postsByPlatform: [ ... ]
// }
```

### Grouping Results

```typescript
// Group by keyword
const byKeyword = manager.getResultsByKeyword();
byKeyword.forEach((posts, keyword) => {
  console.log(`${keyword}: ${posts.length} posts`);
});

// Group by platform
const byPlatform = manager.getResultsByPlatform();
byPlatform.forEach((posts, platform) => {
  console.log(`${platform}: ${posts.length} posts`);
});
```

## Rate Limiting & Best Practices

### Rate Limiting

Both scrapers implement automatic rate limiting:
- **Reddit**: 1 second delay between requests
- **Bluesky**: 500ms delay between requests
- Automatic retry with exponential backoff
- Respects `Retry-After` headers

### Best Practices

1. **Start Small**: Begin with low `maxResults` values (10-25) to test
2. **Be Specific**: Use specific keywords for better results
3. **Use Time Ranges**: Smaller time ranges often yield better results
4. **Monitor Output**: Watch console logs for rate limit warnings
5. **Save Frequently**: Export results regularly to avoid data loss
6. **Respect APIs**: Don't abuse rate limits or scrape excessively

## Troubleshooting

### Common Issues

**Issue**: Rate limited
```
Solution: The scraper will automatically handle this. Wait for the retry.
```

**Issue**: No results found
```
Solution: Try different keywords, longer time range, or different sort order.
```

**Issue**: TypeScript errors
```
Solution: Run `npm install` to ensure all dependencies are installed.
```

**Issue**: Network errors
```
Solution: Check internet connection. The scraper will retry automatically.
```

## Extending the Scraper

### Adding a New Platform

1. Create a new class extending `BaseScraper`:

```typescript
import { BaseScraper, ScrapedPost } from './BaseScraper';

export class TwitterScraper extends BaseScraper {
  getPlatformName(): string {
    return 'Twitter';
  }

  async scrape(): Promise<ScrapedPost[]> {
    // Implement scraping logic
    return [];
  }
}
```

2. Add to `ScraperManager`:

```typescript
// In ScraperManager.ts
if (platforms.includes('twitter')) {
  this.scrapers.set('twitter', new TwitterScraper(this.keywords, this.config));
}
```

3. Export in `index.ts`:

```typescript
export { TwitterScraper } from './TwitterScraper';
```

## API Reference

See [src/scrapers/README.md](src/scrapers/README.md) for detailed API documentation.

## Support

For issues or questions:
1. Check the examples in `examples/`
2. Review the detailed documentation in `src/scrapers/README.md`
3. Examine the source code comments

## License

Part of the Service Genie Pro project.

---

**Happy Scraping!** 🚀
