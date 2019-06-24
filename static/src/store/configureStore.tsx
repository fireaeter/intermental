import { createStore, applyMiddleware, Store } from 'redux'
import rootReducer, {IAppState} from '../reducers';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router'
export const history = require("history").createBrowserHistory();

export function configureStore(): Store<IAppState, any> {
  const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history))))
  return store;
}