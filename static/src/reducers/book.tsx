import { Reducer } from "redux";
import { BookActionTypes } from "../actions/book";

export interface IBook {
  name: string;
}

export interface IBookState {
  readonly book: IBook[];
  readonly isFetching: boolean;
}

const initialBookState: IBookState = {
  book: [],
  isFetching: false
};

export const BookReducer: Reducer<IBookState> = (
  state = initialBookState,
  action
) => {
  switch (action.type) {
    case BookActionTypes.GET: {
      return {
        ...state,
        book: action.book
      };
    }
    case BookActionTypes.FETCHING: {
      return {
        ...state,
        isFetching: action.isFetching
      };
    }
    default:
      return state;
  }
};
