import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { search } from '../lib/search';
import { BadRequestError, InternalServerError } from '../lib/errors';
import { TransformFunc } from '../lib/types';

export function nextAppHandler({ transform }: { transform?: TransformFunc } = {}) {
  return async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const params = Object.fromEntries(searchParams);

      const results = await search(params, transform);

      return NextResponse.json(results);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      if (error instanceof InternalServerError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  };
}

export function nextPagesHandler({ transform }: { transform?: TransformFunc } = {}) {
  return async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== 'GET') {
      return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const params = request.query;

      const results = await search(params, transform);

      return response.json(results);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return response.status(error.status).json({ error: error.message });
      }

      if (error instanceof InternalServerError) {
        return response.status(error.status).json({ error: error.message });
      }

      return response.status(500).json({ error: 'An unexpected error occurred' });
    }
  };
}
