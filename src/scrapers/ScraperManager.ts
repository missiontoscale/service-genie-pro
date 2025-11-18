import { BaseScraper, ScrapedPost, ScraperConfig } from './BaseScraper';
import { RedditScraper } from './RedditScraper';
import { BlueskyScraper } from './BlueskyScraper';

export type PlatformType = 'reddit' | 'bluesky' | 'all';

export interface ScraperManagerConfig extends ScraperConfig {
  platforms?: PlatformType[];
  exportPath?: string;
}

/**
 * Manager class to handle batch keyword scraping across multiple platforms
 */
export class ScraperManager {
  private keywords: string[] = [];
  private scrapers: Map<string, BaseScraper> = new Map();
  private config: ScraperManagerConfig;

  constructor(keywords: string | string[], config: ScraperManagerConfig = {}) {
    this.keywords = Array.isArray(keywords) ? keywords : [keywords];
    this.config = {
      maxResults: config.maxResults || 100,
      sortBy: config.sortBy || 'relevance',
      timeRange: config.timeRange || 'week',
      platforms: config.platforms || ['reddit', 'bluesky'],
      exportPath: config.exportPath,
    };

    this.initializeScrapers();
  }

  /**
   * Initialize scrapers based on selected platforms
   */
  private initializeScrapers(): void {
    const platforms = this.config.platforms!;

    if (platforms.includes('all') || platforms.includes('reddit')) {
      this.scrapers.set('reddit', new RedditScraper(this.keywords, this.config));
    }

    if (platforms.includes('all') || platforms.includes('bluesky')) {
      this.scrapers.set('bluesky', new BlueskyScraper(this.keywords, this.config));
    }
  }

  /**
   * Add more keywords to scrape
   */
  addKeywords(keywords: string | string[]): void {
    const newKeywords = Array.isArray(keywords) ? keywords : [keywords];
    this.keywords = [...this.keywords, ...newKeywords];

    // Update all scrapers with new keywords
    this.scrapers.forEach(scraper => {
      scraper.addKeywords(newKeywords);
    });
  }

  /**
   * Get current keywords
   */
  getKeywords(): string[] {
    return this.keywords;
  }

  /**
   * Scrape all platforms sequentially
   */
  async scrapeAll(): Promise<Map<string, ScrapedPost[]>> {
    const results = new Map<string, ScrapedPost[]>();

    console.log('='.repeat(60));
    console.log('Starting batch scraping...');
    console.log(`Keywords: ${this.keywords.join(', ')}`);
    console.log(`Platforms: ${Array.from(this.scrapers.keys()).join(', ')}`);
    console.log('='.repeat(60));

    for (const [platform, scraper] of Array.from(this.scrapers.entries())) {
      console.log(`\n[${platform.toUpperCase()}] Starting scrape...`);
      try {
        const posts = await scraper.scrape();
        results.set(platform, posts);
        console.log(`[${platform.toUpperCase()}] Completed. Found ${posts.length} posts`);
      } catch (error) {
        console.error(`[${platform.toUpperCase()}] Error:`, error);
        results.set(platform, []);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Batch scraping completed!');
    console.log('='.repeat(60));

    return results;
  }

  /**
   * Scrape all platforms in parallel
   */
  async scrapeAllParallel(): Promise<Map<string, ScrapedPost[]>> {
    const results = new Map<string, ScrapedPost[]>();

    console.log('='.repeat(60));
    console.log('Starting parallel batch scraping...');
    console.log(`Keywords: ${this.keywords.join(', ')}`);
    console.log(`Platforms: ${Array.from(this.scrapers.keys()).join(', ')}`);
    console.log('='.repeat(60));

    const promises = Array.from(this.scrapers.entries()).map(async ([platform, scraper]) => {
      console.log(`[${platform.toUpperCase()}] Starting scrape...`);
      try {
        const posts = await scraper.scrape();
        console.log(`[${platform.toUpperCase()}] Completed. Found ${posts.length} posts`);
        return { platform, posts };
      } catch (error) {
        console.error(`[${platform.toUpperCase()}] Error:`, error);
        return { platform, posts: [] };
      }
    });

    const scraperResults = await Promise.all(promises);

    scraperResults.forEach(({ platform, posts }) => {
      results.set(platform, posts);
    });

    console.log('\n' + '='.repeat(60));
    console.log('Parallel batch scraping completed!');
    console.log('='.repeat(60));

    return results;
  }

  /**
   * Get all results from all scrapers
   */
  getAllResults(): ScrapedPost[] {
    const allResults: ScrapedPost[] = [];

    this.scrapers.forEach(scraper => {
      allResults.push(...scraper.getResults());
    });

    return allResults;
  }

  /**
   * Get results grouped by platform
   */
  getResultsByPlatform(): Map<string, ScrapedPost[]> {
    const results = new Map<string, ScrapedPost[]>();

    this.scrapers.forEach((scraper, platform) => {
      results.set(platform, scraper.getResults());
    });

    return results;
  }

  /**
   * Get results grouped by keyword
   */
  getResultsByKeyword(): Map<string, ScrapedPost[]> {
    const results = new Map<string, ScrapedPost[]>();

    this.keywords.forEach(keyword => {
      results.set(keyword, []);
    });

    this.scrapers.forEach(scraper => {
      scraper.getResults().forEach(post => {
        const keywordPosts = results.get(post.keyword) || [];
        keywordPosts.push(post);
        results.set(post.keyword, keywordPosts);
      });
    });

    return results;
  }

  /**
   * Get comprehensive statistics
   */
  getStats() {
    const allResults = this.getAllResults();
    const platformStats = new Map<string, any>();

    this.scrapers.forEach((scraper, platform) => {
      platformStats.set(platform, scraper.getStats());
    });

    return {
      totalPosts: allResults.length,
      totalKeywords: this.keywords.length,
      platforms: Array.from(this.scrapers.keys()),
      platformStats: Object.fromEntries(platformStats),
      postsByKeyword: Array.from(this.getResultsByKeyword().entries()).map(([keyword, posts]) => ({
        keyword,
        count: posts.length,
      })),
      postsByPlatform: Array.from(this.getResultsByPlatform().entries()).map(([platform, posts]) => ({
        platform,
        count: posts.length,
      })),
    };
  }

  /**
   * Export all results to JSON
   */
  exportToJSON(): string {
    const data = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        keywords: this.keywords,
        platforms: Array.from(this.scrapers.keys()),
        config: this.config,
      },
      stats: this.getStats(),
      results: {
        byPlatform: Object.fromEntries(this.getResultsByPlatform()),
        byKeyword: Object.fromEntries(this.getResultsByKeyword()),
        all: this.getAllResults(),
      },
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Export results to CSV format
   */
  exportToCSV(): string {
    const results = this.getAllResults();

    if (results.length === 0) {
      return 'No results to export';
    }

    // CSV headers
    const headers = [
      'Platform',
      'Keyword',
      'ID',
      'Author',
      'Content',
      'URL',
      'Created At',
      'Score',
      'Comments',
    ];

    // CSV rows
    const rows = results.map(post => [
      post.platform,
      post.keyword,
      post.id,
      post.author,
      `"${post.content.replace(/"/g, '""')}"`, // Escape quotes in content
      post.url,
      post.createdAt.toISOString(),
      post.score?.toString() || '0',
      post.commentCount?.toString() || '0',
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
  }

  /**
   * Clear all results
   */
  clearAllResults(): void {
    this.scrapers.forEach(scraper => {
      scraper.clearResults();
    });
  }

  /**
   * Print summary to console
   */
  printSummary(): void {
    const stats = this.getStats();

    console.log('\n' + '='.repeat(60));
    console.log('SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Posts: ${stats.totalPosts}`);
    console.log(`Keywords: ${this.keywords.join(', ')}`);
    console.log(`Platforms: ${stats.platforms.join(', ')}`);
    console.log('\nPosts by Platform:');
    stats.postsByPlatform.forEach((item: any) => {
      console.log(`  ${item.platform}: ${item.count} posts`);
    });
    console.log('\nPosts by Keyword:');
    stats.postsByKeyword.forEach((item: any) => {
      console.log(`  "${item.keyword}": ${item.count} posts`);
    });
    console.log('='.repeat(60));
  }
}
