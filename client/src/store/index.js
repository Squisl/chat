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
const reducer = combineReducers({
  user,
  channel,
  message,
  error
});

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(refreshToken, thunk))
);
