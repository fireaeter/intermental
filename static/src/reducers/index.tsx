import { combineReducers } from "redux";
import { RouterState, connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";

import { LoadingReducer, ILoadingState } from "./loading";

import { MenuReducer, IMenuState } from "./menu";

import { NotifyReducer, INotifyState } from "./notify";

import { SearchReducer, ISearchState } from "./search";
import { BookReducer, IBookState } from "./book";

import { ThemeReducer, IThemeState } from "./theme";

import { NotesReducer, INotesState } from "./notes";
import { NoteReducer, INoteState } from "./note";

import { DraftsReducer, IDraftsState } from "./drafts";

const history = createBrowserHistory();

export interface IAppState {
  noteState: INoteState;
  notesState: INotesState;
  draftsState: IDraftsState;
  bookState: IBookState;
  searchState: ISearchState;
  notifyState: INotifyState;
  loadingState: ILoadingState;
  menuState: IMenuState;
  themeState: IThemeState;
  router: RouterState;
}

const rootReducer = combineReducers<IAppState>({
  noteState: NoteReducer,
  draftsState: DraftsReducer,
  notesState: NotesReducer,
  bookState: BookReducer,
  searchState: SearchReducer,
  notifyState: NotifyReducer,
  loadingState: LoadingReducer,
  menuState: MenuReducer,
  themeState: ThemeReducer,
  router: connectRouter(history)
});
export default rootReducer;
