import React, { type FC } from 'react';
import SearchBar, { type SearchForm } from './search-bar';
import { usePlaces } from '@/context/place-context';
import { PlaceActionTypes } from '@/reducer/placeReducer';
import getPlaces from '@/endpoints/places/getPlaces';
import { placeToPosition, bboxToLngLatBounds } from '@/util/geospatial';
import bbox from '@turf/bbox';
import { useMap } from 'react-map-gl';
import { type FeatureCollection } from 'geojson';
import { type FSQPlace } from '@/models/foursquare';

const Header: FC = () => {
  const { dispatch } = usePlaces();
  const { 'explore-map': map } = useMap();

  const zoomToPlaces = (places: FSQPlace[]): void => {
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

  const handleSearch = async (data: SearchForm): Promise<void> => {
    try {
      dispatch({
        type: PlaceActionTypes.INITIATING_SEARCH,
      });

      const res = await getPlaces(data, undefined, 50);

      zoomToPlaces(res.data.results);

      dispatch({
        type: PlaceActionTypes.FINISH_SEARCH,
        payload: {
          context: res.data.context,
          places: res.data.results,
          link: res.link,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-24 px-10 py-6 flex items-center border-b border-gray-300 bg-white">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default Header;
