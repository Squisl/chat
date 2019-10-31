import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import user from "../modules/user";
import error from "../modules/error";

// Enable redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Root reducer
const reducer = combineReducers({
  user,
  error
});

export default createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
