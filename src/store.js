import { createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";

import rootReducer from "./reducers";

const initialState = {};
const middleware = [promiseMiddleware, ReduxThunk];

const store = createStore(
  rootReducer,
  initialState,

  // Uncomment if you do not have the extension
  //applyMiddleware(...middleware)

  // Use compose if you have the Redux extension installed in your browser and want to see the application state
  compose(
    applyMiddleware(...middleware)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export default store;
