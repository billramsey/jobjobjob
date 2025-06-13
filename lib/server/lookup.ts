import { AshbyReader } from '@/lib/server/ashby-reader';
import { GeminiReader } from '@/lib/server/gemini-reader';

class Lookup {
  private static RETRYABLE_CODES: number[] = [500, 503, 429];

  static async fetch(url: string) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch (error) {
      return { error: error };
    }
    let reader = null;
    if (parsed.hostname === 'jobs.ashbyhq.com') {
      reader = new AshbyReader(url);
    } else if (parsed.hostname === 'job-boards.greenhouse.io') {
      reader = new GeminiReader(url);
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
