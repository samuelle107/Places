import { type FSQContext, type FSQPlace } from '@/models/foursquare';
import asyncQueryHelper from '../helper';

const pickedFields = [
  'geocodes',
  // 'location',
  'fsq_id',
  'name',
  'rating',
  'photos',
  // 'hours',
  'price',
  'date_closed',
  'stats',
  'categories',
] as const;

type PartialFSQPlace = (typeof pickedFields)[number];

interface PlacesResponse {
  context: FSQContext;
  results: Array<Pick<FSQPlace, PartialFSQPlace>>;
}

export default async function getPlaces(
  query: string,
  token: string,
  signal?: AbortSignal,
  limit = 10
): Promise<PlacesResponse> {
  const fields = pickedFields.join(',');
  const newQuery = [
    query,
    `limit=${limit}`,
    `fields=${fields}`,
    'offset=10',
  ].join('&');
  const url = `https://api.foursquare.com/v3/places/search?${newQuery}`;

  return await asyncQueryHelper<PlacesResponse>(url, {
    signal,
    method: 'get',
    mode: 'cors',
    headers: new Headers({
      Accept: 'application/json',
      Authorization: token,
    }),
  });
}
