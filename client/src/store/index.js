import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import user from "../modules/user";
import channel from "../modules/channel";
import error from "../modules/error";
import message from "../modules/message";
import refreshToken from "../middlewares/refreshToken";

// Enable redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Root reducer
const appReducer = combineReducers({
  user,
  channel,
  message,
  error
});

// On logout reset the redux store state
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_SESSION") return appReducer(undefined, action);
  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(refreshToken, thunk))
);
