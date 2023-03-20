import { type FSQContext, type FSQPlace } from '@/models/foursquare';
import asyncQueryHelper, { type AsyncQueryResponse } from '../helper';
import parse from 'parse-link-header';
import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives/url';

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

const headers = ['link'] as const;

type PlacesHeaders = (typeof headers)[number];

interface PlacesResponse {
  context: FSQContext;
  results: Array<Pick<FSQPlace, PartialFSQPlace>>;
}

const proxy = 'https://cors-anywhere.herokuapp.com/';

export default async function getPlaces(
  params: Record<string, string>,
  signal?: AbortSignal,
  limit = 10
): Promise<AsyncQueryResponse<PlacesResponse, PlacesHeaders>> {
  const fields = pickedFields.join(',');

  const searchParams = new URLSearchParams({
    limit: String(limit),
    fields,
    offset: '10',
    ...params,
  });
  // TODO: This is dumb af. Make own proxy
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const url = `${proxy}https://api.foursquare.com/v3/places/search?${searchParams}`;
  const headers: PlacesHeaders[] = ['link'];
  const res = await asyncQueryHelper<PlacesResponse, PlacesHeaders>(
    url,
    {
      signal,
      method: 'GET',
      mode: 'cors',
      headers: new Headers({
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_TOKEN ?? '',
      }),
    },
    headers
  );

  return {
    ...res,
    link: parse(res.link),
  };
}
