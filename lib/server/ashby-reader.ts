import { Reader } from '@/lib/server/reader';

('server only');

import * as cheerio from 'cheerio';

export class AshbyReader extends Reader {
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
      } else if (parsed.workplaceType === 'Hybrid') {
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
