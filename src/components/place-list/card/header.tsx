import { type FSQPlace } from '@/models/foursquare';
import clsx from 'clsx';
import React, { type FC } from 'react';

interface Props {
  place: FSQPlace;
  isPinned: boolean;

  onPin: (place: FSQPlace) => void;
}

const CardHeader: FC<Props> = ({ place, isPinned, onPin }) => {
  return (
    <div className="flex justify-between">
      <h5 className="font-semibold text-sm">{place.name}</h5>

      <button
        onClick={(e) => {
          e.stopPropagation();

          onPin(place);
        }}
        className={clsx(
          isPinned
            ? 'bg-gray-800 hover:bg-black text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
          'text-xs px-3 py-1 rounded-full transition-all font-semibold h-fit'
        )}
      >
        {isPinned ? 'Unpin' : 'Pin'}
      </button>
    </div>
  );
};

export default CardHeader;
