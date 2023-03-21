import { type LineString, type Position } from 'geojson';

export interface Waypoint {
  name: string;
  location: Position;
  distance?: number;
  metadata?: any;
}

export interface MapboxMatrix {
  code: string;
  durations: number[][];
  distances?: any[];
  sources: Waypoint[];
  destinations: Waypoint[];
}

interface Trip {
  geometry: LineString;
  legs: any[];
  weight: number;
  weight_name: string;
  duration: number;
  distance: number;
}

export interface MapboxOptimization {
  code: string;
  waypoints: Waypoint[];
  trips: [] | [Trip];
}
