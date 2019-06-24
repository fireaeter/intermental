import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import NotifyActionTypes from "./notify";
import { IDraftsState } from "../reducers/drafts";

export enum DraftsActionTypes {
  ADD = "ADD_DRAFT",
  GET = "GET_DRAFTS",
  DELETE = "DELETE_DRAFT"
}

export interface NewDraft {
  book_name: string;
  header: string;
  content: string;
}

export interface IDraftAddAction {
  type: DraftsActionTypes.ADD;
  status: [];
}
export interface IDraftsGetAction {
  type: DraftsActionTypes.GET;
}
export interface IDraftDeleteAction {
  type: DraftsActionTypes.DELETE;
}

export type NotesActions = IDraftAddAction | IDraftsGetAction;

export const addDraft: ActionCreator<
  ThunkAction<Promise<any>, null, null, IDraftAddAction>
> = (draft: NewDraft) => {
  return async (dispatch: Dispatch) => {
    var makeDraft = () => {
      return {
        header: draft.header,
        content: draft.content
      };
    };
    var checkExists = (header: string) => {
      return _drafts[0][draft.book_name].find(item => item.header === header) ==
        undefined
        ? false
        : true;
    };
    var drafts = localStorage.getItem("drafts");
    var _drafts = [{}];
    if (drafts !== null) {
      _drafts = JSON.parse(drafts);
    }
    if (_drafts[0][draft.book_name] == undefined) {
      _drafts[0][draft.book_name] = [];
      _drafts[0][draft.book_name].push(makeDraft());
    } else {
      if (checkExists(draft.header)) {
        dispatch({
          type: NotifyActionTypes.ENQUEUE_SNACKBAR,
          text: "Draft with same header already exists for this book",
          Ntype: "error"
        });
      } else {
        _drafts[0][draft.book_name].push(makeDraft());
      }
    }
    console.log(_drafts);
    localStorage.setItem("drafts", JSON.stringify(_drafts));
  };
};

export const deleteDraft: ActionCreator<
  ThunkAction<Promise<any>, IDraftsState, null, IDraftDeleteAction>
> = (book: string, header: string) => {
  return async (dispatch: Dispatch) => {
    alert("draft tyo delete: vbook " + book + " heeader " + header);
    var drafts = localStorage.getItem("drafts");
    var _drafts = [{}];
    if (drafts !== null) {
      _drafts = JSON.parse(drafts);
    }

    console.log("DRAFTS", _drafts[0][book]);
    for (var i = 0; i < _drafts[0][book].length; i++) {
      if (_drafts[0][book][i]["header"] == header) {
        delete _drafts[0][book][i];
      }
    }
    console.log("DRAFTS", _drafts[0][book]);
    localStorage.setItem("drafts", JSON.stringify(_drafts));
  };
};

// export const getBookDrafts: ActionCreator<
//   ThunkAction<Promise<any>, IDraftsState, null, IDraftsGetAction>
// > = (book_name: string) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       var drafts = {};
//       if (localStorage.getItem("drafts") != null) {
//         drafts = JSON.parse(localStorage.getItem("drafts"));
//       }
//       dispatch({
//         type: DraftsActionTypes.GET,
//         drafts: drafts
//       });
//     } catch (err) {
//       dispatch({
//         type: NotifyActionTypes.ENQUEUE_SNACKBAR,
//         text:
//           "There is a problem occured while getting book drafts. Try again later",
//         Ntype: "error"
//       });
//     }
//   };
// };
export const getAllDrafts: ActionCreator<
  ThunkAction<Promise<any>, IDraftsState, null, IDraftsGetAction>
> = () => {
  return async (dispatch: Dispatch) => {
    try {
      var drafts = {};
      if (localStorage.getItem("drafts") != null) {
        drafts = JSON.parse(localStorage.getItem("drafts"));
      }
      dispatch({
        type: DraftsActionTypes.GET,
        drafts: drafts
      });
    } catch (err) {
      dispatch({
        type: NotifyActionTypes.ENQUEUE_SNACKBAR,
        text:
          "There is a problem occured while getting all drafts. Try again later",
        Ntype: "error"
      });
    }
  };
};
