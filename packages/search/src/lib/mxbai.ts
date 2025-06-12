import Mixedbread from '@mixedbread/sdk';

const mxbai = new Mixedbread({
  apiKey: process.env.MXBAI_API_KEY ?? '',
});

export { mxbai };
