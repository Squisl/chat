// Action Types
const RECEIVE_ERROR = "RECEIVE_ERROR";
const CLEAR_ERROR = "CLEAR_ERROR";

// Action Creators
export const receiveError = error => ({
  type: RECEIVE_ERROR,
  error
});

export const clearError = () => ({
  type: CLEAR_ERROR
});

// Reducer
export default (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ERROR:
      return action.error;
    case CLEAR_ERROR:
      return {};
    default:
      return state;
  }
};
