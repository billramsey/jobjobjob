import { Database } from '@/types/database.types';

type OfficePolicyTypes = Database['public']['Enums']['office_policy_types'];

export interface ListingInfo {
  companyName: string;
  title: string;
  minSalary: number | null;
  maxSalary: number | null;
  officePolicy: OfficePolicyTypes;
}

export class Reader {
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
