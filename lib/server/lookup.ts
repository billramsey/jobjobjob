import * as cheerio from 'cheerio';
('server only');

interface ListingInfo {
  title: string;
  minSalary: number | null;
  maxSalary: number | null;
}

class Reader {
  url: string;
  pageData: string = '';
  title: string = '';
  minSalary: number | null = null;
  maxSalary: number | null = null;

  constructor(url: string) {
    this.url = url;
  }
  getTitle(): string {
    return this.title;
  }
  getMinSalary(): number | null {
    return this.minSalary;
  }
  getMaxSalary(): number | null {
    return this.maxSalary;
  }
  async queryForInfo(): Promise<number> {
    const result = await fetch(this.url);
    this.pageData = await result.text();
    return result.status;
  }
  async parseData(): Promise<boolean> {
    return false;
  }
  async getData(): Promise<ListingInfo> {
    return {
      title: this.getTitle(),
      minSalary: this.getMinSalary(),
      maxSalary: this.getMaxSalary(),
    };
  }
}

class Ashby extends Reader {
  async parseData(): Promise<boolean> {
    const $ = cheerio.load(this.pageData);
    const child = $("script[type='application/ld+json']")[0].children[0];
    if (child.type === 'text') {
      const parsed = JSON.parse(child.data);
      this.title = parsed.title;

      this.minSalary = parsed.baseSalary.value.minValue;
      this.maxSalary = parsed.baseSalary.value.maxValue;
      return true;
    }
    return false;
  }
}

class Lookup {
  private static RETRYABLE_CODES: number[] = [500, 429];

  static async fetch(url: string) {
    const parsed = new URL(url);
    let reader = null;
    if (parsed.hostname == 'jobs.ashbyhq.com') {
      reader = new Ashby(url);
    }
    if (!reader) {
      throw new Error('Unknown reader type');
    }

    let statusCode = await reader.queryForInfo();
    if (statusCode in this.RETRYABLE_CODES) {
      // try again.
      statusCode = await reader.queryForInfo();
      if (statusCode in this.RETRYABLE_CODES) {
        throw new Error(`Received a ${statusCode} trying to lookup ${url}`);
      }
    }
    await reader.parseData();
    return await reader.getData();
  }
}

export default Lookup;
