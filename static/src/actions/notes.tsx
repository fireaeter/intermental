import axios from "axios";
import { push } from "connected-react-router";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import NotifyActionTypes from "./notify";
import LoadingActionTypes from "./loading";
import { INotesState } from "../reducers/notes";

export enum NotesActionTypes {
  ADD = "ADD_NOTE",
  GET = "GET_NOTES"
}

export interface NewNote {
  book_name: string;
  book_password: string;
  header: string;
  content: string;
}

export interface INoteAddAction {
  type: NotesActionTypes.ADD;
  status: [];
}
export interface INotesGetAction {
  type: NotesActionTypes.GET;
  notes: [];
}

export type NotesActions = INoteAddAction | INotesGetAction;

export const addNote: ActionCreator<
  ThunkAction<Promise<any>, null, null, INoteAddAction>
> = (data: NewNote) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      axios
        .post("/note", data)
        .then(function(response) {
          if (response.status === 200) {
            dispatch({
              type: LoadingActionTypes.END
            });
            dispatch({
              type: NotifyActionTypes.ENQUEUE_SNACKBAR,
              text: "A new note " + data["header"] + " was created!",
              Ntype: "success"
            });
            dispatch(push("/book/" + data.book_name));
          }
        })
        .catch(error => {
          dispatch({
            type: NotifyActionTypes.ENQUEUE_SNACKBAR,
            text:
              "There is an error occured while adding note to your book. Check your password. Try again later",
            Ntype: "error"
          });
          dispatch({
            type: LoadingActionTypes.END
          });
        });
    } catch (err) {
      console.error(err);
    }
  };
};

export const getNotes: ActionCreator<
  ThunkAction<Promise<any>, INotesState, null, INotesGetAction>
> = (book_name: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      const response = await axios.get("/notes/" + book_name);
      dispatch({
        type: NotesActionTypes.GET,
        notes: response.data
      });
      dispatch({
        type: LoadingActionTypes.END
      });
    } catch (err) {
      dispatch({
        type: LoadingActionTypes.END
      });
      dispatch({
        type: NotifyActionTypes.ENQUEUE_SNACKBAR,
        text:
          "There is a problem occured while getting book notes. Try again later",
        Ntype: "error"
      });
    }
  };
};
