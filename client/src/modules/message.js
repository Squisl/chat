// Action Types
const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";

// Action Creators
export const receiveMessages = messages => ({
  type: RECEIVE_MESSAGES,
  messages
});

export const receiveMessage = message => ({
  type: RECEIVE_MESSAGE,
  message
});

export default (state = [], action) => {
  switch (action.type) {
    case RECEIVE_MESSAGES:
      return action.messages;
    case RECEIVE_MESSAGE:
      return state.concat(action.message);
    default:
      return state;
  }
};
