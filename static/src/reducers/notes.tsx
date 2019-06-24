import { Reducer } from "redux";
import { NotesActionTypes } from "../actions/notes";

export interface INote {
  header: string;
  content: string;
}

export interface INotesState {
  readonly notes: INote[];
}

const initialNotesState: INotesState = {
  notes: []
};

export const NotesReducer: Reducer<INotesState> = (
  state = initialNotesState,
  action
) => {
  switch (action.type) {
    case NotesActionTypes.GET: {
      return {
        ...state,
        notes: action.notes
      };
    }
    default:
      return state;
  }
};
