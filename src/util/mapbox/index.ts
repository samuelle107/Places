import { type Feature, type FeatureCollection } from 'geojson';
import { type GeoJSONSource, type MapRef } from 'react-map-gl';

export function getMapboxGeoJSONSource(
  map: MapRef | undefined,
  layerId: string
): GeoJSONSource | undefined {
  return map?.getSource(layerId) as GeoJSONSource;
}

export function updateMapboxGeoJSONSource(
  map: MapRef | undefined,
  layerId: string,
  data: Feature | FeatureCollection
): void {
  try {
    getMapboxGeoJSONSource(map, layerId)?.setData(data);
  } catch (err) {
    console.error(err);
  }
}
