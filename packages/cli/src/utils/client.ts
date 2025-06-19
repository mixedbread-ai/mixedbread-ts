import { Mixedbread } from '@mixedbread/sdk';
import { getApiKey, getBaseURL } from './config';

export function createClient(options?: { apiKey?: string; baseURL?: string }): Mixedbread {
  const apiKey = getApiKey(options);
  const baseURL = getBaseURL(options);

  return new Mixedbread({
    apiKey,
    baseURL,
  });
}
