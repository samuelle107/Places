import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
): Promise<any> {
  const t = new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        reject(result);
      }

      resolve(result);
    });
  });

  return await t;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const searchParams = new URLSearchParams({
    ...(req.query as any),
  });
  // Run the middleware
  await runMiddleware(req, res, cors);

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const url = `https://api.foursquare.com/v3/places/search?${searchParams}`;

  const fsqRes = await fetch(url, {
    headers: new Headers({
      authorization: process.env.NEXT_PUBLIC_FSQ_API_TOKEN ?? '',
    }),
  });

  const data = await fsqRes.json();

  const link = fsqRes.headers.get('link');

  if (link !== null) {
    res.setHeader('link', link);
  }

  res.status(200).send(data);
}
