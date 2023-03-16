import Image from 'next/image';
import React, { type FC, useMemo } from 'react';

import { type FSQPlace } from '@/models/foursquare';
import CardHeader from './header';
import CardBody from './body';

const thumbnailSize = 96;

interface Props {
  place: FSQPlace;
  isPinned: boolean;
  onPin: (place: FSQPlace) => void;
  onCardClick: (place: FSQPlace) => void;
}

const PlaceCard: FC<Props> = ({ place, onPin, isPinned, onCardClick }) => {
  const photoSource = useMemo(() => {
    if (place.photos !== undefined) {
      if (place.photos[0] === undefined) {
        return null;
      }

      const { prefix, suffix } = place.photos[0];

      return `${prefix}${thumbnailSize}x${thumbnailSize}${suffix}`;
    }

    return null;
  }, [place.photos]);

  return (
    <div className="flex flex-col gap-y-2">
      {/* Card */}
      <div
        className="p-3 hover:bg-gray-100 rounded cursor-pointer min-h-[96px]"
        onClick={(e) => {
          e.preventDefault();

          onCardClick(place);
        }}
      >
        <div className="flex gap-x-4">
          {photoSource !== null && (
            <Image
              width={thumbnailSize}
              height={thumbnailSize}
              alt={place?.name ?? 'Restaurant'}
              placeholder="empty"
              className="rounded w-24 h-24 text-center bg-gray-200"
              src={photoSource}
            />
          )}

          <div className="flex-grow">
            <CardHeader place={place} isPinned={isPinned} onPin={onPin} />
            <CardBody place={place} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className=" border-b border-gray-300" />
    </div>
  );
};

export default PlaceCard;
