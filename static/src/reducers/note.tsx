import { Reducer } from "redux";
import { NoteActionTypes } from "../actions/note";

export interface INote {
  header: string;
  content: string;
}

export interface INoteState {
  readonly note: any;
  readonly isFetching: boolean;
}

const initialNoteState: INoteState = {
  note: null,
  isFetching: false
};

export const NoteReducer: Reducer<INoteState> = (
  state = initialNoteState,
  action
) => {
  switch (action.type) {
    case NoteActionTypes.GET_NOTE: {
      return {
        ...state,
        note: action.note
      };
    }
    case NoteActionTypes.FETCHING: {
      return {
        ...state,
        isFetching: action.isFetching
      };
    }
    default:
      return state;
  }
};
