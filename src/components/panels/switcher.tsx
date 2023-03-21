import React, { useState, type FC, useEffect } from 'react';
import PanelWrapper from './wrapper';
import { TabKey } from '../nav/tab-bar';
import { useMap } from 'react-map-gl';
import { usePlaces } from '@/context/place-context';
import { type FSQPlace } from '@/models/foursquare';
import { PlaceActionTypes } from '@/reducer/placeReducer';
import PlaceList from '../place-list';
import { type Feature, type FeatureCollection } from 'geojson';

import bbox from '@turf/bbox';
import getPlaces from '@/endpoints/places/getPlaces';
import getOptimalPath from '@/endpoints/mapbox/getOptimalPath';
import { bboxToLngLatBounds, placeToPosition } from '@/util/geospatial';
import { MapLayerId } from '../../mapbox/layers';
import { updateMapboxGeoJSONSource } from '@/util/mapbox';

interface Props {
  isOpen: boolean;
}

const PanelSwitcher: FC<Props> = ({ isOpen }) => {
  const { 'explore-map': map } = useMap();
  const {
    state: {
      pinnedPlaces,
      context,
      results: { places, isLoading, link, isLoadingMorePlaces },
    },
    dispatch,
  } = usePlaces();
  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.SEARCH);

  const zoomToPinnedPlaces = (places: FSQPlace[]): void => {
    if (places.length === 0) return;

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: places.map((place) => ({
        id: place.fsq_id,
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // Remember, coordinates go lng lat
          coordinates: placeToPosition(place),
        },
      })),
    };

    const bounds = bboxToLngLatBounds(bbox(fc));

    try {
      map?.fitBounds(bounds, {
        padding: {
          bottom: 200,
          top: 200,
          left: 400,
          right: 400,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleSeeMore = (): void => {
    if (link === null) return;

    const { rel, url, ...params } = link.next;

    dispatch({
      type: PlaceActionTypes.LOADING_MORE_PLACES,
    });

    getPlaces(params, undefined)
      .then((res) => {
        dispatch({
          type: PlaceActionTypes.SEE_MORE_PLACES,
          payload: {
            context: res.data.context,
            link: res.link,
            places: res.data.results,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnCalculatePath = async (): Promise<void> => {
    const coordinates = pinnedPlaces.map((place) => {
      return placeToPosition(place);
    });

    await getOptimalPath(coordinates).then((res) => {
      const firstTrip = res.data.trips[0];

      if (firstTrip !== undefined) {
        const feature: Feature = {
          type: 'Feature',
          geometry: firstTrip.geometry,
          properties: {},
        };

        updateMapboxGeoJSONSource(map, MapLayerId.OPTIMAL_PATH, feature);
        zoomToPinnedPlaces(pinnedPlaces);
      }
    });
  };

  /**
   * Hide pins when not in Search view
   * Show optimal path when in pinned mode
   * */
  // TODO: Move to hook
  useEffect(() => {
    try {
      switch (selectedTab) {
        case TabKey.SEARCH: {
          map
            ?.getMap()
            .setLayoutProperty(MapLayerId.PLACES, 'visibility', 'visible');

          map
            ?.getMap()
            .setLayoutProperty(MapLayerId.OPTIMAL_PATH, 'visibility', 'none');

          map
            ?.getMap()
            .setLayoutProperty(
              MapLayerId.OPTIMAL_PATH_STROKE,
              'visibility',
              'none'
            );

          break;
        }
        case TabKey.PINNED: {
          map
            ?.getMap()
            .setLayoutProperty(MapLayerId.PLACES, 'visibility', 'none');

          map
            ?.getMap()
            .setLayoutProperty(
              MapLayerId.OPTIMAL_PATH,
              'visibility',
              'visible'
            );

          map
            ?.getMap()
            .setLayoutProperty(
              MapLayerId.OPTIMAL_PATH_STROKE,
              'visibility',
              'visible'
            );

          break;
        }
        default: {
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [map, selectedTab]);

  /** Add context center to map */
  useEffect(() => {
    if (context === null) return;

    const { center } = context.geo_bounds.circle;

    const contextFeature: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [center.longitude, center.latitude],
      },
    };

    updateMapboxGeoJSONSource(map, MapLayerId.CONTEXT_CENTER, contextFeature);
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
          coordinates: placeToPosition(place),
        },
      })),
    };

    updateMapboxGeoJSONSource(map, MapLayerId.PLACES, fc);
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
          coordinates: placeToPosition(place),
        },
      })),
    };

    updateMapboxGeoJSONSource(map, MapLayerId.PINNED_PLACES, fc);
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
          <div className="flex justify-center items-center px-6 py-4">
            <button
              className="bg-gray-800 px-4 py-2 rounded text-white w-full"
              onClick={() => {
                void handleOnCalculatePath();
              }}
            >
              Find Optimal Path
            </button>
          </div>

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

          <div className="flex justify-center items-center px-6 py-4">
            {link !== null && (
              <button
                disabled={isLoadingMorePlaces}
                onClick={handleSeeMore}
                className="bg-gray-800 px-4 py-2 rounded text-white w-full"
              >
                {isLoadingMorePlaces ? 'Loading...' : 'See More'}
              </button>
            )}
          </div>
        </PanelWrapper>
      );
    }
    default: {
      throw Error('Invalid tab');
    }
  }
};

export default PanelSwitcher;
