import { type FSQPlace } from '@/models/foursquare';
import React, { memo, type FC } from 'react';
import PlaceCard from './card';

interface Props {
  pinnedPlaces?: FSQPlace[];
  places: FSQPlace[];
  onPin: (place: FSQPlace) => void;
  onCardClick: (place: FSQPlace) => void;

  isLoading?: boolean;
}

const PlaceList: FC<Props> = ({
  places,
  pinnedPlaces,
  isLoading,
  onPin,
  onCardClick,
}) => {
  console.log('re-rendered');
  if (isLoading === true) {
    return <>Loading</>;
  }

  return (
    <>
      {
        <div className="flex flex-col p-8 gap-y-2">
          {places.map((place) => (
            <PlaceCard
              isPinned={
                pinnedPlaces !== undefined
                  ? pinnedPlaces?.findIndex(
                      (item) => place.fsq_id === item.fsq_id
                    ) > -1
                  : true
              }
              onCardClick={onCardClick}
              onPin={onPin}
              place={place}
              key={place.fsq_id}
            />
          ))}
        </div>
      }
    </>
  );
};

export default memo(PlaceList);
