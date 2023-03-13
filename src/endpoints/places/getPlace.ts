import { type FSQPlace } from '@/models/foursquare';
import asyncQueryHelper from '../helper';

export default async function getPlace(
  fsqId: string,
  token: string,
  signal?: AbortSignal
): Promise<FSQPlace> {
  const url = `https://api.foursquare.com/v3/places/${fsqId}`;

  return await asyncQueryHelper<FSQPlace>(url, {
    signal,
    method: 'get',
    headers: new Headers({
      Accept: 'application/json',
      Authorization: token,
    }),
  });
}
