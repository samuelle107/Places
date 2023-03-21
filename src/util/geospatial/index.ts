import { type FSQPlace } from '@/models/foursquare';
import { type BBox } from 'geojson';
import mapboxgl from 'mapbox-gl';

/** Converts the place's main lat/lng to a geojson Position */
export function placeToPosition(place: FSQPlace): [number, number] {
  return [
    place.geocodes?.main.longitude ?? 0,
    place.geocodes?.main.latitude ?? 0,
  ];
}

export function bboxToLngLatBounds(box: BBox): mapboxgl.LngLatBounds {
  const [lng1, lat1, lng2, lat2] = box;

  return new mapboxgl.LngLatBounds([lng1, lat1], [lng2, lat2]);
}
