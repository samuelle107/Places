import { type FSQPlace } from '@/models/foursquare';
import React, { type FC } from 'react';

interface Props {
  categories: FSQPlace['categories'];
}

const CardCategoriesContainer: FC<Props> = ({ categories }) => {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-2">
      {categories?.map((category) => (
        <div
          className="bg-gray-200 w-fit px-2 rounded-full py-1"
          key={category?.id}
        >
          <p className="text-[11px] text-gray-800 font-medium">
            {category?.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CardCategoriesContainer;
