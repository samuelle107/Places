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
import getPlaces from '@/endpoints/places/getPlaces';

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
      results: { places, isLoading, link, isLoadingMorePlaces },
    },
    dispatch,
  } = usePlaces();
  const [selectedTab, setSelectedTab] = useState<TabKey>(TabKey.SEARCH);

  console.log(isLoadingMorePlaces);

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

    try {
      (map?.getSource('context') as GeoJSONSource | undefined)?.setData(
        contextFeature
      );
    } catch (err) {
      console.error(err);
    }

    try {
      (map?.getSource('context-center') as GeoJSONSource | undefined)?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [center.longitude, center.latitude],
        },
      });
    } catch (err) {
      console.error(err);
    }
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

    try {
      (map?.getSource('places') as GeoJSONSource | undefined)?.setData(fc);
    } catch (err) {
      console.error(err);
    }

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

    try {
      (map?.getSource('pinned-places') as GeoJSONSource | undefined)?.setData(
        fc
      );
    } catch (err) {
      console.error(err);
    }
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

          <div className="flex justify-center items-center  px-6 py-4">
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
