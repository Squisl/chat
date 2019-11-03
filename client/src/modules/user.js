import fetchAPI from "../utilities/fetchAPI";
import { receiveError } from "./error";

// Action Types
const RECEIVE_SESSION_USER = "RECEIVE_SESSION_USER";
const LOGOUT_SESSION = "LOGOUT_SESSION";
const RECEIVE_USERS = "RECEIVE_USERS";
const RECEIVE_USER = "RECEIVE_USER";
const REMOVE_USER = "REMOVE_USER";

// Action Creators
export const receiveSessionUser = user => ({
  type: RECEIVE_SESSION_USER,
  user
});

export const logoutSession = () => ({
  type: LOGOUT_SESSION
});

export const receiveUsers = users => ({
  type: RECEIVE_USERS,
  users
});

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

export const removeUser = user_id => ({
  type: REMOVE_USER,
  user_id
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

export const logout = () => async dispatch => {
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
  authenticated: false,
  channel: []
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
    case RECEIVE_USERS:
      return {
        ...state,
        channel: action.users
      };
    case RECEIVE_USER:
      return {
        ...state,
        channel: state.channel.concat(action.user)
      };
    case REMOVE_USER:
      return {
        ...state,
        channel: state.channel.filter(user => user.id !== action.user_id)
      };
    default:
      return state;
  }
};
