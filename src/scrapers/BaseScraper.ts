/**
 * Base abstract class for social media scrapers
 * Implements common scraping functionality and interface
 */
export interface ScrapedPost {
  id: string;
  author: string;
  content: string;
  url: string;
  createdAt: Date;
  score?: number;
  commentCount?: number;
  platform: string;
  keyword: string;
}

export interface ScraperConfig {
  maxResults?: number;
  sortBy?: 'relevance' | 'new' | 'top';
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
}

export abstract class BaseScraper {
  protected keywords: string[] = [];
  protected config: ScraperConfig;
  protected results: ScrapedPost[] = [];

  constructor(keywords: string | string[], config: ScraperConfig = {}) {
    this.keywords = Array.isArray(keywords) ? keywords : [keywords];
    this.config = {
      maxResults: config.maxResults || 100,
      sortBy: config.sortBy || 'relevance',
      timeRange: config.timeRange || 'week',
    };
  }

  /**
   * Abstract method to be implemented by each platform scraper
   */
  abstract scrape(): Promise<ScrapedPost[]>;

  /**
   * Get the platform name
   */
  abstract getPlatformName(): string;

  /**
   * Add keywords to the scraper
   */
  addKeywords(keywords: string | string[]): void {
    const newKeywords = Array.isArray(keywords) ? keywords : [keywords];
    this.keywords = [...this.keywords, ...newKeywords];
  }

  /**
   * Get current keywords
   */
  getKeywords(): string[] {
    return this.keywords;
  }

  /**
   * Get scraped results
   */
  getResults(): ScrapedPost[] {
    return this.results;
  }

  /**
   * Clear results
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ScraperConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  getConfig(): ScraperConfig {
    return this.config;
  }

  /**
   * Export results to JSON
   */
  exportToJSON(): string {
    return JSON.stringify(this.results, null, 2);
  }

  /**
   * Get statistics about scraped results
   */
  getStats() {
    return {
      platform: this.getPlatformName(),
      totalPosts: this.results.length,
      keywords: this.keywords,
      postsByKeyword: this.results.reduce((acc, post) => {
        acc[post.keyword] = (acc[post.keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageScore: this.results.reduce((sum, post) => sum + (post.score || 0), 0) / this.results.length || 0,
    };
  }
}
