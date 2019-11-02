import fetchAPI from "../utilities/fetchAPI";

// Action Types
const RECEIVE_CHANNELS = "RECEIVE_CHANNELS";
const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
const SWITCH_CHANNEL = "SWITCH_CHANNEL";

// Action Creators
export const receiveChannels = channels => ({
  type: RECEIVE_CHANNELS,
  channels
});

export const receiveChannel = channel => ({
  type: RECEIVE_CHANNEL,
  channel
});

export const switchChannel = channel => ({
  type: SWITCH_CHANNEL,
  channel
});

export const fetchChannels = setLoading => async dispatch => {
  try {
    const response = await fetchAPI("/api/channel", "GET");
    dispatch(receiveChannels(response));
    setLoading(false);
  } catch (e) {
    console.error(e);
  }
};

// Initial state of the reducer
const initialState = {
  all: [],
  current: { id: 1, name: "Lobby" }
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_CHANNELS:
      return {
        ...state,
        all: action.channels
      };
    case RECEIVE_CHANNEL:
      return {
        ...state,
        all: state.all.concat(action.channel)
      };
    case SWITCH_CHANNEL:
      return {
        ...state,
        current: action.channel
      };
    default:
      return state;
  }
};
