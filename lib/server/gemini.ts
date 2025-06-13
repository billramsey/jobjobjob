import { GenerateContentResponse, GoogleGenAI } from '@google/genai';

// Gemini currently can be sent a urlContext, or it can return structured data.
// but it can't do both.  We need urlContext to work, so we are just going to manually
// parse the weird response from Gemini.

export const salaryRangeQuery = (url: string) => {
  return `look up the salary range and job title and company name at ${url} and return the salary range and title in a json object 
  with the keys minSalary, maxSalary, title and companyName where minSalary and maxSalary are whole numbers and title and
  companyName is a string.
  if you can't find a salary range, return 0 for both values, if you can't find a title or companyName, return empty string`;
};

export const queryGemini = async (text: string): Promise<GenerateContentResponse> => {
  const GEMINI_API_KEY = process.env.PRIVATE_GEMINI_KEY;
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: text,
    config: {
      tools: [{ urlContext: {} }],
    },
  });
};

type ParsedResponse = {
  minSalary: number;
  maxSalary: number;
  title: string;
  companyName: string;
  officePolicy: string;
};
export const parseGeminiJson = (geminiString: string): ParsedResponse => {
  const stripped = geminiString.replaceAll('\`', '').replaceAll('json', '').trim();

  const parsedResponse = {
    minSalary: 0,
    maxSalary: 0,
    title: 'Unknown',
    companyName: 'Unknown',
    officePolicy: 'unknown',
  };
  try {
    const parsed = JSON.parse(stripped);
    // May need to try to parse as number.
    parsedResponse.minSalary = parsed.minSalary || 0;
    parsedResponse.maxSalary = parsed.maxSalary || 0;
    parsedResponse.title = parsed.title || 'Unknown';
    parsedResponse.companyName = parsed.companyName || '';
  } catch {
    console.log(`Unable to gemini response ${stripped}`);
  }
  return parsedResponse;
};
