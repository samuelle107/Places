import clsx from 'clsx';
import React, { type FC } from 'react';

interface Props {
  onClick: () => void;
  isPinned: boolean;
}

const PinButton: FC<Props> = ({ onClick, isPinned }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();

        onClick();
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
  );
};

export default PinButton;
