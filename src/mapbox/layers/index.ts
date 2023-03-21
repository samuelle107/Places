import { type CircleLayer, type LineLayer } from 'mapbox-gl';

export enum MapLayerId {
  PLACES = 'places',
  PINNED_PLACES = 'pinned-places',
  OPTIMAL_PATH = 'optimal-path',
  OPTIMAL_PATH_STROKE = 'optimal-path-stroke',
  CONTEXT_CENTER = 'context-center',
}

export const placesLayer: CircleLayer = {
  id: MapLayerId.PLACES,
  type: 'circle',
  paint: {
    'circle-radius': 8,
    'circle-color': '#9ca3af',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 2,
  },
};

export const pinnedPlacesLayer: CircleLayer = {
  id: MapLayerId.PINNED_PLACES,
  type: 'circle',
  paint: {
    'circle-radius': 8,
    'circle-color': '#1F2937',
    'circle-stroke-color': 'white',
    'circle-stroke-width': 2,
  },
};

export const optimalPathLayer: LineLayer = {
  id: MapLayerId.OPTIMAL_PATH,
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#9ca3af',
    'line-width': 5,
  },
};

export const optimalPathLayerStroke: LineLayer = {
  id: MapLayerId.OPTIMAL_PATH_STROKE,
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#1F2937',
    'line-width': 9,
  },
};

export const contextPlaceLayer: CircleLayer = {
  id: MapLayerId.CONTEXT_CENTER,
  type: 'circle',
  paint: {
    'circle-color': '#3B82F6',
    'circle-radius': 10,
    'circle-stroke-color': 'white',
    'circle-stroke-width': 3,
  },
};
