import React, { useState, type FC, useEffect } from 'react';
import PanelWrapper from './wrapper';
import { TabKey } from '../nav/tab-bar';
import { type GeoJSONSource, useMap } from 'react-map-gl';
import { usePlaces } from '@/context/place-context';
import { type FSQPlace } from '@/models/foursquare';
import { PlaceActionTypes } from '@/reducer/placeReducer';
import PlaceList from '../place-list';
import { type BBox, type Feature, type FeatureCollection } from 'geojson';
import circle from '@turf/circle';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';

function bboxToLngLatBounds(box: BBox): mapboxgl.LngLatBounds {
  const [lng1, lat1, lng2, lat2] = box;

  return new mapboxgl.LngLatBounds([lng1, lat1], [lng2, lat2]);
}

interface Props {
  isOpen: boolean;
}

const PanelSwitcher: FC<Props> = ({ isOpen }) => {
  const { 'explore-map': map } = useMap();
  const {
    state: {
      pinnedPlaces,
      context,
      results: { places, isLoading },
    },
    dispatch,
  } = usePlaces();
  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.SEARCH);

  console.log(pinnedPlaces);

  const handleOnPin = (place: FSQPlace): void => {
    dispatch({
      type: PlaceActionTypes.PIN_UNPIN_PLACE,
      payload: place,
    });
  };

  const handleOnCardClick = (place: FSQPlace): void => {
    dispatch({
      type: PlaceActionTypes.OPEN_PLACE_DETAILS,
      payload: place,
    });
  };

  /** Hide pins when not in Search view */
  useEffect(() => {
    try {
      if (selectedTab !== TabKey.SEARCH) {
        map?.getMap().setLayoutProperty('places', 'visibility', 'none');
      } else {
        map?.getMap().setLayoutProperty('places', 'visibility', 'visible');
      }
    } catch (err) {}
  }, [map, selectedTab]);

  useEffect(() => {
    if (context === null) return;

    const { center, radius } = context.geo_bounds.circle;

    const contextFeature: Feature = circle(
      [center.longitude, center.latitude],
      radius / 1000
    );

    (map?.getSource('context') as GeoJSONSource | undefined)?.setData(
      contextFeature
    );

    (map?.getSource('context-center') as GeoJSONSource | undefined)?.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [center.longitude, center.latitude],
      },
    });
  }, [context, map]);

  /** Add place pins to the map */
  useEffect(() => {
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: places.map((place) => ({
        id: place.fsq_id,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // Remember, coordinates go lng lat
          coordinates: [
            place.geocodes?.main.longitude ?? 0,
            place.geocodes?.main.latitude ?? 0,
          ],
        },
      })),
    };

    (map?.getSource('places') as GeoJSONSource | undefined)?.setData(fc);

    if (places.length !== 0) {
      const bounds = bboxToLngLatBounds(bbox(fc));

      try {
        map?.fitBounds(bounds, {
          padding: 200,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [map, places]);

  /** Add pinned places to the map */
  useEffect(() => {
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: pinnedPlaces.map((place) => ({
        id: place.fsq_id,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // Remember, coordinates go lng lat
          coordinates: [
            place.geocodes?.main.longitude ?? 0,
            place.geocodes?.main.latitude ?? 0,
          ],
        },
      })),
    };

    (map?.getSource('pinned-places') as GeoJSONSource | undefined)?.setData(fc);
  }, [map, pinnedPlaces]);

  switch (selectedTab) {
    case TabKey.PINNED: {
      return (
        <PanelWrapper
          selectedTab={selectedTab}
          onTabChange={(tab) => {
            setSelectedTab(tab);
          }}
          title="Pinned"
          isOpen={isOpen}
        >
          <PlaceList
            onCardClick={handleOnCardClick}
            places={pinnedPlaces}
            onPin={handleOnPin}
          />
        </PanelWrapper>
      );
    }
    case TabKey.SEARCH: {
      return (
        <PanelWrapper
          selectedTab={selectedTab}
          onTabChange={(tab) => {
            setSelectedTab(tab);
          }}
          title="Search"
          isOpen={isOpen}
        >
          <PlaceList
            onCardClick={handleOnCardClick}
            pinnedPlaces={pinnedPlaces}
            places={places}
            isLoading={isLoading}
            onPin={handleOnPin}
          />
        </PanelWrapper>
      );
    }
    default: {
      throw Error('Invalid tab');
    }
  }
};

export default PanelSwitcher;
