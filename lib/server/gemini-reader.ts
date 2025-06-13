import { ListingInfo, Reader } from '@/lib/server/reader';
import { parseGeminiJson, queryGemini, salaryRangeQuery } from '@/lib/server/gemini';

('server only');

export class GeminiReader extends Reader {
  async queryForInfo(): Promise<number> {
    const aiQueryText = salaryRangeQuery(this.url);

    let aiText = '';
    try {
      const aiResponse = await queryGemini(aiQueryText);
      aiText = aiResponse.text || '';
    } catch (error) {
      console.log('error', error);
      return 503;
    }
    this.pageData = aiText;
    return 200;
  }
  async parseData(): Promise<boolean> {
    const jsonResult = parseGeminiJson(this.pageData);

    if (jsonResult.minSalary) {
      this.minSalary = jsonResult.minSalary;
    }
    if (jsonResult.maxSalary) {
      this.maxSalary = jsonResult.maxSalary;
    }
    if (jsonResult.title) {
      this.title = jsonResult.title;
    }
    if (jsonResult.companyName) {
      this.companyName = jsonResult.companyName;
    }
    return true;
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
