import React, { type FC } from 'react';
import SearchBar, { type SearchForm } from './search-bar';
import { usePlaces } from '@/context/place-context';
import { PlaceActionTypes } from '@/reducer/placeReducer';
import getPlaces from '@/endpoints/places/getPlaces';

const Header: FC = () => {
  const { dispatch } = usePlaces();

  const handleSearch = async (data: SearchForm): Promise<void> => {
    const query = Object.entries(data)
      .map(([k, v]) => `${k}=${String(v)}`)
      .join(`&`);

    try {
      dispatch({
        type: PlaceActionTypes.INITIATING_SEARCH,
      });

      const res = await getPlaces(
        query,
        'fsq3wy8eteCb+VjgidlF9NGJp4yCrFgXaJHUfzVMN7SmF0s=',
        undefined,
        50
      );

      dispatch({
        type: PlaceActionTypes.FINISH_SEARCH,
        payload: {
          context: res.context,
          places: res.results,
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
