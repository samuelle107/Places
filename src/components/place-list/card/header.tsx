import PinButton from '@/components/pin-button';
import { type FSQPlace } from '@/models/foursquare';
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

      <PinButton
        isPinned={isPinned}
        onClick={() => {
          onPin(place);
        }}
      />
    </div>
  );
};

export default CardHeader;
