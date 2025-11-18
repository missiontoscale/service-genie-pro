import { BaseScraper, ScrapedPost, ScraperConfig } from './BaseScraper';

interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName?: string;
  };
  record: {
    text: string;
    createdAt: string;
  };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
}

interface BlueskySearchResponse {
  posts: BlueskyPost[];
  cursor?: string;
}

/**
 * Bluesky scraper implementation using AT Protocol API
 */
export class BlueskyScraper extends BaseScraper {
  private baseUrl = 'https://public.api.bsky.app/xrpc';
  private defaultLimit = 100;

  constructor(keywords: string | string[], config: ScraperConfig = {}) {
    super(keywords, config);
  }

  getPlatformName(): string {
    return 'Bluesky';
  }

  /**
   * Scrape Bluesky for all keywords
   */
  async scrape(): Promise<ScrapedPost[]> {
    this.clearResults();

    for (const keyword of this.keywords) {
      console.log(`Scraping Bluesky for keyword: "${keyword}"`);
      const posts = await this.scrapeKeyword(keyword);
      this.results.push(...posts);
    }

    return this.results;
  }

  /**
   * Scrape Bluesky for a single keyword
   */
  private async scrapeKeyword(keyword: string): Promise<ScrapedPost[]> {
    const posts: ScrapedPost[] = [];
    let cursor: string | undefined = undefined;
    let fetchedCount = 0;

    try {
      while (fetchedCount < this.config.maxResults!) {
        const url = this.buildSearchUrl(keyword, cursor);
        const response = await this.fetchWithRetry(url);

        if (!response.ok) {
          console.error(`Failed to fetch Bluesky data: ${response.status} ${response.statusText}`);
          break;
        }

        const data: BlueskySearchResponse = await response.json();

        if (!data.posts || data.posts.length === 0) {
          break;
        }

        for (const post of data.posts) {
          if (fetchedCount >= this.config.maxResults!) {
            break;
          }

          posts.push(this.transformPost(post, keyword));
          fetchedCount++;
        }

        cursor = data.cursor;

        if (!cursor) {
          break;
        }

        // Rate limiting: wait between requests
        await this.sleep(500);
      }

      console.log(`Found ${posts.length} posts for "${keyword}" on Bluesky`);
    } catch (error) {
      console.error(`Error scraping Bluesky for "${keyword}":`, error);
    }

    return posts;
  }

  /**
   * Build search URL with parameters
   */
  private buildSearchUrl(keyword: string, cursor?: string): string {
    const params = new URLSearchParams({
      q: keyword,
      limit: Math.min(this.defaultLimit, this.config.maxResults!).toString(),
    });

    if (cursor) {
      params.append('cursor', cursor);
    }

    // Sort parameter mapping
    const sort = this.mapSortBy();
    if (sort) {
      params.append('sort', sort);
    }

    return `${this.baseUrl}/app.bsky.feed.searchPosts?${params.toString()}`;
  }

  /**
   * Map our generic sort options to Bluesky's sort options
   */
  private mapSortBy(): string {
    switch (this.config.sortBy) {
      case 'new':
        return 'latest';
      case 'top':
        return 'top';
      default:
        return 'latest';
    }
  }

  /**
   * Transform Bluesky post to our standard format
   */
  private transformPost(post: BlueskyPost, keyword: string): ScrapedPost {
    // Extract post ID from URI (format: at://did:plc:xxx/app.bsky.feed.post/yyy)
    const postId = post.uri.split('/').pop() || post.cid;

    // Construct web URL
    const webUrl = `https://bsky.app/profile/${post.author.handle}/post/${postId}`;

    return {
      id: post.cid,
      author: post.author.displayName || post.author.handle,
      content: post.record.text,
      url: webUrl,
      createdAt: new Date(post.record.createdAt),
      score: (post.likeCount || 0) + (post.repostCount || 0),
      commentCount: post.replyCount || 0,
      platform: 'Bluesky',
      keyword,
    };
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
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
   * Get posts from a specific user
   */
  async scrapeUserPosts(handle: string, limit?: number): Promise<ScrapedPost[]> {
    const posts: ScrapedPost[] = [];
    const maxPosts = limit || this.config.maxResults!;
    let cursor: string | undefined = undefined;

    try {
      while (posts.length < maxPosts) {
        const params = new URLSearchParams({
          actor: handle,
          limit: Math.min(100, maxPosts - posts.length).toString(),
        });

        if (cursor) {
          params.append('cursor', cursor);
        }

        const url = `${this.baseUrl}/app.bsky.feed.getAuthorFeed?${params.toString()}`;
        const response = await this.fetchWithRetry(url);

        if (!response.ok) {
          console.error(`Failed to fetch user posts: ${response.status}`);
          break;
        }

        const data = await response.json();

        if (!data.feed || data.feed.length === 0) {
          break;
        }

        for (const item of data.feed) {
          if (posts.length >= maxPosts) {
            break;
          }

          if (item.post) {
            posts.push(this.transformPost(item.post, `@${handle}`));
          }
        }

        cursor = data.cursor;

        if (!cursor) {
          break;
        }

        await this.sleep(500);
      }

      console.log(`Found ${posts.length} posts from @${handle}`);
    } catch (error) {
      console.error(`Error scraping posts from @${handle}:`, error);
    }

    return posts;
  }

  /**
   * Search posts with hashtag
   */
  async scrapeHashtag(hashtag: string): Promise<ScrapedPost[]> {
    const searchTerm = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    return this.scrapeKeyword(searchTerm);
  }
}
