// import { type Place } from '@/endpoints/places/getPlaces';

import { type FSQContext, type FSQPlace } from '@/models/foursquare';

type ActionMap<M extends Record<string, any>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

type Action<T extends Record<string, any>> = ActionMap<T>[keyof ActionMap<T>];

export interface PlacesReducer {
  results: {
    places: FSQPlace[];
    isLoading: boolean;
    activePlace: FSQPlace | null;
  };
  pinnedPlaces: FSQPlace[];
  context: FSQContext | null;
}

export enum PlaceActionTypes {
  // Places
  INITIATING_SEARCH = 'INITIATING_SEARCH',
  SET_PLACES = 'SET_PLACES',
  ADD_PLACES = 'ADD_PLACES',
  CLEAR_PLACES = 'CLEAR_PLACES',

  // Place
  OPEN_PLACE_DETAILS = 'OPEN_PLACE_DETAILS',
  CLOSE_PLACE_DETAILS = 'CLOSE_PLACE_DETAILS',

  // Pinning
  PIN_UNPIN_PLACE = 'PIN_UNPIN_PLACE',
  // CLEAR_PINS = 'CLEAR_PINS',

  // Context
  ADD_CONTEXT = 'ADD_CONTEXT',
  CLEAR_CONTEXT = 'CLEAR_CONTEXT',

  FINISH_SEARCH = 'FINISH_SEARCH',
}

interface PlacePayload {
  [PlaceActionTypes.SET_PLACES]: FSQPlace[];
  [PlaceActionTypes.ADD_PLACES]: FSQPlace[];
  [PlaceActionTypes.FINISH_SEARCH]: {
    places: FSQPlace[];
    context: FSQContext;
  };

  [PlaceActionTypes.INITIATING_SEARCH]: never;
  [PlaceActionTypes.CLEAR_PLACES]: never;

  [PlaceActionTypes.OPEN_PLACE_DETAILS]: FSQPlace;
  [PlaceActionTypes.CLOSE_PLACE_DETAILS]: never;
}

interface PinnedPlacePayload {
  [PlaceActionTypes.PIN_UNPIN_PLACE]: FSQPlace;
}

interface ContextPayload {
  [PlaceActionTypes.ADD_CONTEXT]: FSQContext;
  [PlaceActionTypes.CLEAR_CONTEXT]: never;

  [PlaceActionTypes.FINISH_SEARCH]: {
    places: FSQPlace[];
    context: FSQContext;
  };
}

export type PlaceActions = Action<PlacePayload>;

export type PinnedPlacesActions = Action<PinnedPlacePayload>;

export type ContextActions = Action<ContextPayload>;

export type AllPlaceActions =
  | PlaceActions
  | PinnedPlacesActions
  | ContextActions;

export const placesReducer = (
  state: PlacesReducer['results'],
  action: AllPlaceActions
): PlacesReducer['results'] => {
  switch (action.type) {
    case PlaceActionTypes.INITIATING_SEARCH: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case PlaceActionTypes.FINISH_SEARCH: {
      return {
        ...state,
        places: action.payload.places,
        isLoading: false,
      };
    }
    case PlaceActionTypes.CLEAR_PLACES: {
      return {
        ...state,
        places: [],
        isLoading: false,
      };
    }
    case PlaceActionTypes.OPEN_PLACE_DETAILS: {
      return {
        ...state,
        activePlace: action.payload,
      };
    }
    case PlaceActionTypes.CLOSE_PLACE_DETAILS: {
      return {
        ...state,
        activePlace: null,
      };
    }
    default: {
      return state;
    }
  }
};

export const pinnedPlacesReducer = (
  state: PlacesReducer['pinnedPlaces'],
  action: AllPlaceActions
): PlacesReducer['pinnedPlaces'] => {
  switch (action.type) {
    case PlaceActionTypes.PIN_UNPIN_PLACE: {
      if (
        state.find((item) => item.fsq_id === action.payload.fsq_id) !==
        undefined
      ) {
        return state.filter((item) => item.fsq_id !== action.payload.fsq_id);
      }

      return [...state, action.payload];
    }
    default: {
      return state;
    }
  }
};

export const contextReducer = (
  state: PlacesReducer['context'],
  action: AllPlaceActions
): PlacesReducer['context'] => {
  switch (action.type) {
    case PlaceActionTypes.FINISH_SEARCH: {
      return action.payload.context;
    }
    case PlaceActionTypes.CLEAR_CONTEXT: {
      return null;
    }
    default: {
      return state;
    }
  }
};
