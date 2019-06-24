import { Reducer } from "redux";
import { DraftsActionTypes } from "../actions/drafts";

export interface IDraft {
  header: string;
  content: string;
}

export interface IDraftsState {
  readonly drafts: any;
}
var drafts = localStorage.getItem('drafts')
var _drafts = [{}] 
if(drafts !== null) {
  _drafts = JSON.parse(drafts)
}
const initialDraftsState: IDraftsState = {
  drafts: _drafts
};

export const DraftsReducer: Reducer<IDraftsState> = (
  state = initialDraftsState,
  action
) => {
  switch (action.type) {
    case DraftsActionTypes.GET: {
      return {
        ...state,
        drafts: action.drafts
      };
    }
    default:
      return state;
  }
};
