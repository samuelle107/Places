import { type FSQPlace } from '@/models/foursquare';
import clsx from 'clsx';
import React, { type FC } from 'react';

interface Props {
  place: FSQPlace;
}

const CardRatings: FC<Props> = ({ place }) => {
  if (place.rating === undefined) {
    return <p className="text-gray-800 text-xs font-medium">Not Yet Rated</p>;
  }

  const { rating, stats } = place;

  return (
    <div className="flex gap-x-1 items-center">
      {Array.from(Array(5).keys()).map((item) => (
        <div
          className="h-2 w-2 rounded-full border border-gray-800 relative overflow-hidden"
          // Item + 1 is the current circle (1-5)
          key={item + 1}
        >
          <div
            className={clsx(
              rating / 2 >= item + 1 && 'bg-gray-800 w-full',
              Math.floor(rating / 2) === item &&
                (rating / 2) % 1 > 0.5 &&
                'w-1/2 bg-gray-800',
              'h-full'
            )}
          />
        </div>
      ))}

      <p className="text-gray-800 text-xs font-medium">
        {stats?.total_ratings}
      </p>
    </div>
  );
};

export default CardRatings;
