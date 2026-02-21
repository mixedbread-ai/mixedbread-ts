import Mixedbread from '@mixedbread/sdk';

export const mxbai = new Mixedbread({
  apiKey: process.env.MXBAI_API_KEY ?? '',
});
