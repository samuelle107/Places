import { type MapboxOptimization } from '@/models/mapbox';
import { type Position } from 'geojson';
import asyncQueryHelper, { type AsyncQueryResponse } from '../helper';

const url = 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';

export default async function getOptimalPath(
  coordinates: Position[],
  signal?: AbortSignal
): Promise<AsyncQueryResponse<MapboxOptimization>> {
  const formattedCoordinates: string = coordinates
    .map((coordinate) => coordinate.join(','))
    .join(';');

  const params = new URLSearchParams({
    access_token: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN ?? '',
    geometries: 'geojson',
    steps: 'true',
  });

  return await asyncQueryHelper<MapboxOptimization>(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${url}${formattedCoordinates}?${params}`,
    {
      signal,
    }
  );
}
