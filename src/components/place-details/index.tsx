import getPlace from '@/endpoints/places/getPlace';
import { type FSQPlace } from '@/models/foursquare';
import clsx from 'clsx';
import React, { useEffect, type FC, useState } from 'react';
import CardRatings from '../place-list/card/body/ratings';
import CardCategoriesContainer from '../place-list/card/body/categories-container';
import CardBody from '../place-list/card/body';

interface Props {
  place: FSQPlace;
}

const OFFSET = 36;

const PlaceDetails: FC<Props> = ({ place }) => {
  const [leftOffset, setLeftOffset] = useState(OFFSET);
  const [placeDetails, setPlaceDetails] = useState<FSQPlace | null>(null);

  /** Calculate offset */
  useEffect(() => {
    const offset = document.getElementById('panel-parent')?.clientWidth ?? 0;

    setLeftOffset(offset + OFFSET);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (place.fsq_id !== undefined) {
      getPlace(
        place.fsq_id,
        'fsq3wy8eteCb+VjgidlF9NGJp4yCrFgXaJHUfzVMN7SmF0s=',
        controller.signal
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      controller.abort();
    };
  }, [place]);

  return (
    <div
      className={clsx(
        'absolute right-9 bottom-9 z-20',
        'bg-white rounded-lg p-2'
      )}
      style={{
        left: leftOffset,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-sm">{place.name}</h5>

        <button className=" bg-gray-200 hover:bg-gray-300 transition-colors w-6 h-6  rounded-full flex items-center justify-center text-gray-900">
          <span className="material-icons text-sm">close</span>
        </button>
      </div>

      <CardBody place={place} />
    </div>
  );
};

export default PlaceDetails;
