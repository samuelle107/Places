import { type FSQPlace } from '@/models/foursquare';
import React, { memo, type FC } from 'react';
import CardRatings from './ratings';
import CardCategoriesContainer from './categories-container';
import clsx from 'clsx';

interface Props {
  place: FSQPlace;
}

interface DayOfTheWeek {
  label: string;
  value: number;
}

const daysOfTheWeek: DayOfTheWeek[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(
  (item, i) => ({
    label: item,
    value: i + 1,
  })
);

function isPlaceOpen(day: number, hours: FSQPlace['hours']): boolean {
  if (hours?.regular !== undefined) {
    const openDate = hours.regular.find((item) => item?.day === day);

    if (openDate !== undefined) {
      return true;
    }
  }

  return false;
}

const CardBody: FC<Props> = ({ place }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <CardRatings place={place} />

      {place.location !== undefined && (
        <div className="flex gap-x-1 items-center">
          <span className="material-icons !text-base">location_on</span>

          <p className="text-xs text-gray-600">
            {place.location?.formatted_address}
          </p>
        </div>
      )}

      {place.hours !== undefined && (
        <div className="flex gap-x-1 items-center">
          <span className="material-icons !text-base">schedule</span>

          <div className="flex gap-x-1">
            {daysOfTheWeek.map((day) => (
              <div
                className={clsx(
                  isPlaceOpen(day.value, place.hours)
                    ? 'bg-gray-300 text-gray-700'
                    : 'bg-gray-200 text-gray-500',
                  ' w-4 h-4 rounded-full flex items-center justify-center relative overflow-hidden'
                )}
                key={day.value}
              >
                <p className="text-[10px] font-medium text-center ">
                  {day.label}
                </p>

                {!isPlaceOpen(day.value, place.hours) && (
                  <div className="h-[20px] w-[1px] bg-gray-500 absolute rotate-45" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2">
        <CardCategoriesContainer categories={place.categories} />
      </div>
    </div>
  );
};

export default memo(CardBody);
