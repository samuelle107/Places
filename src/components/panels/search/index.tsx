import React, { type FC, useEffect } from 'react';

import { type GeoJSONSource, useMap } from 'react-map-gl';
import { type Feature, type BBox, type FeatureCollection } from 'geojson';

import bbox from '@turf/bbox';
import type mapboxgl from 'mapbox-gl';
import circle from '@turf/circle';
import { type FSQPlace } from '@/models/foursquare';
import { usePlaces } from '@/context/place-context';
import PlaceList from '@/components/place-list';

// fsq3wy8eteCb+VjgidlF9NGJp4yCrFgXaJHUfzVMN7SmF0s=

export function getAdjustedPaddingOptions(
  padding = 200
): mapboxgl.PaddingOptions {
  const offset: number =
    document.getElementById('panel-parent')?.clientWidth ?? 0;

  return {
    bottom: padding,
    right: padding + offset,
    left: padding + offset,
    top: padding,
  };
}

interface Props {
  pinnedPlaces: FSQPlace[];

  onPin: (place: FSQPlace) => void;
}

const SearchPanel: FC<Props> = ({ pinnedPlaces, onPin }) => {
  const { 'explore-map': map } = useMap();
  const {
    state: {
      results: { places, isLoading },
      context,
    },
  } = usePlaces();

  return (
    <PlaceList
      onCardClick={onCardClick}
      pinnedPlaces={pinnedPlaces}
      places={places}
      isLoading={isLoading}
      onPin={onPin}
    />
  );
};

export default SearchPanel;
