import { type FSQPlace } from '@/models/foursquare';
import React, { type FC } from 'react';
import CardRatings from './ratings';
import CardCategoriesContainer from './categories-container';

interface Props {
  place: FSQPlace;
}

const CardBody: FC<Props> = ({ place }) => {
  return (
    <div className="flex flex-col gap-y-3">
      <CardRatings place={place} />

      <CardCategoriesContainer categories={place.categories} />
    </div>
  );
};

export default CardBody;
