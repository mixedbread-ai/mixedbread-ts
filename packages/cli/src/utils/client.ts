import { Mixedbread } from '@mixedbread/sdk';
import { getApiKey } from './config';

export function createClient(options?: { apiKey?: string }): Mixedbread {
  const apiKey = getApiKey(options);
  const baseURL = process.env.MXBAI_BASE_URL;

  return new Mixedbread({
    apiKey,
    ...(baseURL && { baseURL }),
  });
}
