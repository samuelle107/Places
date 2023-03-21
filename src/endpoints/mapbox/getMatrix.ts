import { type MapboxMatrix } from '@/models/mapbox';
import { type Position } from 'geojson';
import asyncQueryHelper, { type AsyncQueryResponse } from '../helper';

const url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/';

export default async function getMatrix(
  coordinates: Position[],
  signal?: AbortSignal
): Promise<AsyncQueryResponse<MapboxMatrix>> {
  const formattedCoordinates: string = coordinates
    .map((coordinate) => coordinate.join(','))
    .join(';');

  const params = new URLSearchParams({
    access_token: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN ?? '',
  });

  return await asyncQueryHelper<MapboxMatrix>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${url}${formattedCoordinates}?${params}`,
    {
      signal,
    }
  );
}
