import axios from "axios";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import NotifyActionTypes from "./notify";
import LoadingActionTypes from "./loading";
import { ISearch, ISearchState } from "../reducers/search";

// Create Action Constants
export enum SearchActionTypes {
  SEARCH = "SEARCH",
  FETCHING = "SEARCH_QUERY_FETCHING"
}

// Interface for Get All Action Type
export interface ISearchSearchAction {
  type: SearchActionTypes.SEARCH;
  results: ISearch[];
}

/* 
Combine the action types with a union (we assume there are more)
example: export type CharacterActions = IGetAllAction | IGetOneAction ... 
*/
export type SearchActions = ISearchSearchAction;

/* Get All Action
<Promise<Return Type>, State Interface, Type of Param, Type of Action> */
export const search: ActionCreator<
  ThunkAction<Promise<any>, ISearchState, null, ISearchSearchAction>
> = (query: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: LoadingActionTypes.START
      });
      dispatch({
        type: SearchActionTypes.FETCHING,
        isFetching: true
      });
      const response = await axios.post("/search", {
        query: query
      });
      dispatch({
        type: SearchActionTypes.SEARCH,
        results: response.data
      });
      dispatch({
        type: SearchActionTypes.FETCHING,
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
