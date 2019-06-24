import axios from "axios";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import NotifyActionTypes from "./notify";
import LoadingActionTypes from "./loading";
import { IBookState } from "../reducers/book";

export enum BookActionTypes {
  CREATE = "CREATE_BOOK",
  GET = "GET_BOOK",
  FETCHING = "BOOK_FETCHING"
}

export interface NewBook {
  name: string;
  password: string;
  author: string;
  description: string;
  keywords: string;
}

export interface IBookCreateAction {
  type: BookActionTypes.CREATE;
  status: [];
}
export interface IBookGetAction {
  type: BookActionTypes.GET;
  book: [];
}

export type BookActions = IBookCreateAction | IBookGetAction;

export const createBook: ActionCreator<
  ThunkAction<Promise<any>, null, null, IBookCreateAction>
> = (data: NewBook) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      axios
        .post("/book", data)
        .then(function(response) {
          if (response.status === 200) {
            dispatch({
              type: LoadingActionTypes.END
            });
            dispatch({
              type: NotifyActionTypes.ENQUEUE_SNACKBAR,
              message:
                "A new book with name- " +
                data["name"] +
                " -was created! Let's write your first note"
            });
          }
        })
        .catch(error => {
          dispatch({
            type: NotifyActionTypes.ENQUEUE_SNACKBAR,
            text:
              "There is an error occured while adding your book. Maybe book with this name is exists",
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

export const getBook: ActionCreator<
  ThunkAction<Promise<any>, IBookState, null, IBookGetAction>
> = (name: string) => {
  return async (dispatch: Dispatch) => {
    // const response = await axios.get('/book/'+name);
    //   dispatch({
    //     type: BookActionTypes.GET,
    //     book: response.data['book']
    //   })
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      dispatch({
        type: BookActionTypes.FETCHING,
        isFetching: true
      });
      const response = await axios.get("/book/" + name);
      dispatch({
        type: BookActionTypes.GET,
        book: response.data
      });
      dispatch({
        type: BookActionTypes.FETCHING,
        isFetching: false
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
          "There is a problem occured while sending search request. Try later",
        Ntype: "error"
      });
    }
  };
};
