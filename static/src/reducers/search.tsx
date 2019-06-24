import { Reducer } from "redux";
import { SearchActionTypes } from "../actions/search";

export interface ISearch {
  name: string;
}

export interface ISearchState {
  readonly results: ISearch[];
  readonly isFetching: boolean;
}

const initialSearchState: ISearchState = {
  results: [],
  isFetching: false
};

export const SearchReducer: Reducer<ISearchState> = (
  state = initialSearchState,
  action
) => {
  switch (action.type) {
    case SearchActionTypes.SEARCH: {
      return {
        ...state,
        results: action.results
      };
    }
    case SearchActionTypes.FETCHING: {
      return {
        ...state,
        isFetching: action.isFetching
      };
    }
    default:
      return state;
  }
};
