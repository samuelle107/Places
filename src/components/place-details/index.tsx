import getPlace from '@/endpoints/places/getPlace';
import { type FSQPlace } from '@/models/foursquare';
import clsx from 'clsx';
import React, { useEffect, type FC, useState, memo } from 'react';
import { useMap } from 'react-map-gl';

import CardBody from '../place-list/card/body';

interface Props {
  isSidePanelExpanded: boolean;
  place: FSQPlace;
  onDetailsClose: () => void;
}

const OFFSET = 36;

const PlaceDetails: FC<Props> = ({
  isSidePanelExpanded,
  place,
  onDetailsClose,
}) => {
  const { 'explore-map': map } = useMap();

  const [leftOffset, setLeftOffset] = useState(OFFSET);
  const [isLoading, setIsLoading] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<FSQPlace | null>(null);

  const handleZoomToLocation = (): void => {
    map?.flyTo({
      center: [
        place.geocodes?.roof.longitude ?? 0,
        place.geocodes?.roof.latitude ?? 0,
      ],
      zoom: 20,
    });
  };

  /** Calculate offset */
  useEffect(() => {
    if (isSidePanelExpanded) {
      const offset = document.getElementById('panel-parent')?.clientWidth ?? 0;

      setLeftOffset(offset + OFFSET);
    } else {
      setLeftOffset(OFFSET);
    }
  }, [isSidePanelExpanded]);

  /** Fetch details */
  useEffect(() => {
    const controller = new AbortController();

    if (place.fsq_id !== undefined) {
      setIsLoading(true);

      setPlaceDetails(null);

      getPlace(place.fsq_id, controller.signal)
        .then((res) => {
          setPlaceDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
          setPlaceDetails(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
  }, [place]);

  // if (isLoading) {
  //   return <>Loading</>;
  // }

  return (
    <div
      className={clsx(
        'absolute bottom-9 z-10 min-w-[500px] min-h-[200px]',
        'bg-white rounded-lg p-2 transition-all shadow-xl max-h-[400px] overflow-auto'
      )}
      style={{
        left: leftOffset,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h5 className="font-semibold text-sm text-gray-800">{place?.name}</h5>

        {/* Close button */}
        <button
          onClick={onDetailsClose}
          className=" bg-gray-200 hover:bg-gray-300 transition-colors w-6 h-6  rounded-full flex items-center justify-center text-gray-900"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>

      {placeDetails !== null && (
        <>
          <CardBody place={placeDetails} />

          <div className=" h-[1px] w-full bg-gray-200 my-4" />

          <button
            onClick={handleZoomToLocation}
            className="bg-gray-800 px-3 py-2 rounded text-white text-sm font-semibold"
          >
            Zoom to Location
          </button>
        </>
      )}
    </div>
  );
};

export default memo(PlaceDetails);
