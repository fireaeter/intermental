import axios from "axios";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import NotifyActionTypes from "./notify";
import LoadingActionTypes from "./loading";
import { INoteState } from "../reducers/note";

export enum NoteActionTypes {
  ADD = "ADD_NOTE",
  FETCHING = "NOTE_FETCHING",
  GET_NOTE = "GET_NOTE"
}

export interface NewNote {
  book_name: string;
  book_password: string;
  header: string;
  content: string;
}

export interface INoteAddAction {
  type: NoteActionTypes.ADD;
  status: [];
}

export interface INoteGetAction {
  type: NoteActionTypes.GET_NOTE;
}

export const getNote: ActionCreator<
  ThunkAction<Promise<any>, INoteState, null, INoteGetAction>
> = (book_name: string, hash: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      dispatch({
        type: NoteActionTypes.FETCHING,
        isFetching: true
      });
      const response = await axios.get("/note/" + book_name + "/" + hash);
      dispatch({
        type: NoteActionTypes.GET_NOTE,
        note: response.data
      });
      dispatch({
        type: LoadingActionTypes.END
      });
      dispatch({
        type: NoteActionTypes.FETCHING,
        isFetching: false
      });
    } catch (err) {
      dispatch({
        type: LoadingActionTypes.END
      });
      dispatch({
        type: NoteActionTypes.FETCHING,
        isFetching: false
      });
      dispatch({
        type: NotifyActionTypes.ENQUEUE_SNACKBAR,
        text:
          "There is a problem occured while getting book note. Try again later",
        Ntype: "error"
      });
    }
  };
};
