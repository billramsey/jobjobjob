('server only');

import * as cheerio from 'cheerio';
import { Database } from '@/types/database.types';

type OfficePolicyTypes = Database['public']['Enums']['office_policy_types'];

interface ListingInfo {
  companyName: string,
  title: string;
  minSalary: number | null;
  maxSalary: number | null;
  officePolicy: OfficePolicyTypes;
}

class Reader {
  url: string;
  pageData: string = '';
  title: string = '';
  minSalary: number | null = null;
  maxSalary: number | null = null;
  officePolicy: OfficePolicyTypes = 'unknown';
  companyName: string = '';
  constructor(url: string) {
    this.url = url;
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
      companyName: this.companyName,
      title: this.title,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      officePolicy: this.officePolicy,
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
      // "isRemote": false,
      // "workplaceType": "Hybrid",
      // turns out this is in the app_data, not the ld+json, so we'll have to find another way to look this up
      // skipping for now.
      if (parsed.isRemote) {
        this.officePolicy = 'remote';
      } else if (parsed.workplaceType === "Hybrid") {
        this.officePolicy = 'hybrid';
      }
      this.companyName = parsed.hiringOrganization.name;
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
    let parsed;
    try {
      parsed = new URL(url);
    } catch (error) {
      return { error: error };
    }
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
