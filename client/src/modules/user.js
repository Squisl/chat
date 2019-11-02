import fetchAPI from "../utilities/fetchAPI";
import { receiveError } from "./error";

// Action Types
const RECEIVE_SESSION_USER = "RECEIVE_SESSION_USER";
const LOGOUT_SESSION = "LOGOUT_SESSION";

// Action Creators
export const receiveSessionUser = user => ({
  type: RECEIVE_SESSION_USER,
  user
});

export const logoutSession = () => ({
  type: LOGOUT_SESSION
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

export const logout = history => async dispatch => {
  // Remove access token from the local storage
  localStorage.removeItem("token");
  // Delete the cookie containing the refresh token
  try {
    await fetchAPI("/api/user/logout", "GET");
  } catch (e) {
    console.error(e);
  }
  console.log("LOGOUT SESSION");
  dispatch(logoutSession());
};

export const loadUser = setLoading => async dispatch => {
  try {
    const response = await fetchAPI("/api/user/reload", "GET");
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
    case LOGOUT_SESSION:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
