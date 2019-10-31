import fetchAPI from "../utilities/fetchAPI";
import { receiveError } from "./error";

// Action Types
const RECEIVE_SESSION_USER = "RECEIVE_SESSION_USER";

// Action Creators
export const receiveSessionUser = user => ({
  type: RECEIVE_SESSION_USER,
  user
});

export const register = (data, history) => async dispatch => {
  try {
    const response = await fetchAPI("/api/user/register", "POST", data);
    const { user, token } = response;
    dispatch(receiveSessionUser(user));
    localStorage.setItem("token", token);
    history.push("/chat");
  } catch (e) {
    console.error(e);
    dispatch(receiveError(e));
  }
};

export const login = (data, history) => async dispatch => {
  try {
    const response = await fetchAPI("/api/user/login", "POST", data);
    const { user, token } = response;
    dispatch(receiveSessionUser(user));
    localStorage.setItem("token", token);
    history.push("/chat");
  } catch (e) {
    console.error(e);
    dispatch(receiveError(e));
  }
};

export const loadUser = setLoading => async dispatch => {
  try {
    const response = await fetchAPI("/api/user/reload", "GET");
    console.log("Load User", response);
    dispatch(receiveSessionUser(response));
    setLoading(false);
  } catch (e) {
    console.error(e);
  }
};

// Initial state of the reducer
const initialState = {
  session: {},
  authenticated: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SESSION_USER:
      return {
        ...state,
        session: action.user,
        authenticated: true
      };
    default:
      return state;
  }
};
