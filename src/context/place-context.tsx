import { PanelTabKey } from '@/models/panel';
import {
  type AllPlaceActions,
  contextReducer,
  pinnedPlacesReducer,
  placesReducer,
  type PlacesReducer,
  panelReducer,
} from '@/reducer/placeReducer';
import React, {
  type Dispatch,
  createContext,
  type FC,
  useReducer,
  type PropsWithChildren,
  useContext,
} from 'react';

const initialState: PlacesReducer = {
  pinnedPlaces: [],
  results: {
    activePlace: null,
    places: [],
    isLoading: false,
  },
  context: null,
  panel: {
    isExpanded: true,
    currentTab: {
      value: PanelTabKey.SEARCH,
      label: 'Search',
    },
  },
};

interface PlaceContext {
  state: PlacesReducer;
  dispatch: Dispatch<AllPlaceActions>;
}

const PlacesContext = createContext<PlaceContext>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  { results, pinnedPlaces, context, panel }: PlacesReducer,
  action: AllPlaceActions
): PlacesReducer => ({
  results: placesReducer(results, action),
  pinnedPlaces: pinnedPlacesReducer(pinnedPlaces, action),
  context: contextReducer(context, action),
  panel: panelReducer(panel, action),
});

const PlaceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <PlacesContext.Provider value={{ dispatch, state }}>
      {children}
    </PlacesContext.Provider>
  );
};

const usePlaces = (): PlaceContext => {
  const { state, dispatch } = useContext(PlacesContext);

  return {
    state,
    dispatch,
  };
};

export { PlaceProvider, PlacesContext, usePlaces };
