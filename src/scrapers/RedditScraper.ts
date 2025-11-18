import { BaseScraper, ScrapedPost, ScraperConfig } from './BaseScraper';

interface RedditPost {
  data: {
    id: string;
    author: string;
    title: string;
    selftext: string;
    url: string;
    permalink: string;
    created_utc: number;
    score: number;
    num_comments: number;
    subreddit: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
    after: string | null;
  };
}

/**
 * Reddit scraper implementation using Reddit's public JSON API
 */
export class RedditScraper extends BaseScraper {
  private userAgent = 'ServiceGeniePro/1.0';
  private baseUrl = 'https://www.reddit.com';

  constructor(keywords: string | string[], config: ScraperConfig = {}) {
    super(keywords, config);
  }

  getPlatformName(): string {
    return 'Reddit';
  }

  /**
   * Scrape Reddit for all keywords
   */
  async scrape(): Promise<ScrapedPost[]> {
    this.clearResults();

    for (const keyword of this.keywords) {
      console.log(`Scraping Reddit for keyword: "${keyword}"`);
      const posts = await this.scrapeKeyword(keyword);
      this.results.push(...posts);
    }

    return this.results;
  }

  /**
   * Scrape Reddit for a single keyword
   */
  private async scrapeKeyword(keyword: string): Promise<ScrapedPost[]> {
    const posts: ScrapedPost[] = [];
    let after: string | null = null;
    let fetchedCount = 0;

    try {
      while (fetchedCount < this.config.maxResults!) {
        const url = this.buildSearchUrl(keyword, after);
        const response = await this.fetchWithRetry(url);

        if (!response.ok) {
          console.error(`Failed to fetch Reddit data: ${response.status} ${response.statusText}`);
          break;
        }

        const data: RedditResponse = await response.json();

        if (!data.data.children || data.data.children.length === 0) {
          break;
        }

        for (const post of data.data.children) {
          if (fetchedCount >= this.config.maxResults!) {
            break;
          }

          posts.push(this.transformPost(post, keyword));
          fetchedCount++;
        }

        after = data.data.after;

        if (!after) {
          break;
        }

        // Rate limiting: wait between requests
        await this.sleep(1000);
      }

      console.log(`Found ${posts.length} posts for "${keyword}" on Reddit`);
    } catch (error) {
      console.error(`Error scraping Reddit for "${keyword}":`, error);
    }

    return posts;
  }

  /**
   * Build search URL with parameters
   */
  private buildSearchUrl(keyword: string, after: string | null): string {
    const params = new URLSearchParams({
      q: keyword,
      sort: this.mapSortBy(),
      t: this.config.timeRange || 'week',
      limit: '100',
      raw_json: '1',
    });

    if (after) {
      params.append('after', after);
    }

    return `${this.baseUrl}/search.json?${params.toString()}`;
  }

  /**
   * Map our generic sort options to Reddit's sort options
   */
  private mapSortBy(): string {
    switch (this.config.sortBy) {
      case 'new':
        return 'new';
      case 'top':
        return 'top';
      case 'relevance':
      default:
        return 'relevance';
    }
  }

  /**
   * Transform Reddit post to our standard format
   */
  private transformPost(post: RedditPost, keyword: string): ScrapedPost {
    return {
      id: post.data.id,
      author: post.data.author,
      content: post.data.selftext || post.data.title,
      url: `https://www.reddit.com${post.data.permalink}`,
      createdAt: new Date(post.data.created_utc * 1000),
      score: post.data.score,
      commentCount: post.data.num_comments,
      platform: 'Reddit',
      keyword,
    };
  }

  /**
   * Fetch with retry logic for rate limiting
   */
  private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': this.userAgent,
          },
        });

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60');
          console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
          await this.sleep(retryAfter * 1000);
          continue;
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.sleep(1000 * (i + 1));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Search specific subreddit(s)
   */
  async scrapeSubreddits(subreddits: string[]): Promise<ScrapedPost[]> {
    this.clearResults();

    for (const subreddit of subreddits) {
      for (const keyword of this.keywords) {
        console.log(`Scraping r/${subreddit} for keyword: "${keyword}"`);
        const posts = await this.scrapeSubredditKeyword(subreddit, keyword);
        this.results.push(...posts);
      }
    }

    return this.results;
  }

  /**
   * Scrape a specific subreddit for a keyword
   */
  private async scrapeSubredditKeyword(subreddit: string, keyword: string): Promise<ScrapedPost[]> {
    const posts: ScrapedPost[] = [];
    let after: string | null = null;
    let fetchedCount = 0;

    try {
      while (fetchedCount < this.config.maxResults!) {
        const params = new URLSearchParams({
          q: keyword,
          sort: this.mapSortBy(),
          t: this.config.timeRange || 'week',
          restrict_sr: 'true',
          limit: '100',
          raw_json: '1',
        });

        if (after) {
          params.append('after', after);
        }

        const url = `${this.baseUrl}/r/${subreddit}/search.json?${params.toString()}`;
        const response = await this.fetchWithRetry(url);

        if (!response.ok) {
          console.error(`Failed to fetch from r/${subreddit}: ${response.status}`);
          break;
        }

        const data: RedditResponse = await response.json();

        if (!data.data.children || data.data.children.length === 0) {
          break;
        }

        for (const post of data.data.children) {
          if (fetchedCount >= this.config.maxResults!) {
            break;
          }

          posts.push(this.transformPost(post, keyword));
          fetchedCount++;
        }

        after = data.data.after;

        if (!after) {
          break;
        }

        await this.sleep(1000);
      }

      console.log(`Found ${posts.length} posts in r/${subreddit} for "${keyword}"`);
    } catch (error) {
      console.error(`Error scraping r/${subreddit} for "${keyword}":`, error);
    }

    return posts;
  }
}
