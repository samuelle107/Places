import { type FSQPlace } from '@/models/foursquare';
import asyncQueryHelper from '../helper';

const pickedFields = [
  'geocodes',
  'location',
  'fsq_id',
  'name',
  'rating',
  'photos',
  'hours',
  'price',
  'date_closed',
  'stats',
  'categories',
  'tastes',
  'description',
  'website',
  'tel',
] as const;

type PartialFSQPlace = (typeof pickedFields)[number];

export default async function getPlace(
  fsqId: string,
  token: string,
  signal?: AbortSignal
): Promise<Pick<FSQPlace, PartialFSQPlace>> {
  const fields = pickedFields.join(',');
  const url = `https://api.foursquare.com/v3/places/${fsqId}?fields=${fields}`;

  return await asyncQueryHelper<Pick<FSQPlace, PartialFSQPlace>>(url, {
    signal,
    method: 'get',
    headers: new Headers({
      Accept: 'application/json',
      Authorization: token,
    }),
  });
}
