// playerReducer.js

// Enum for Action Types
export const PlayerActionTypes = {
  INIT_PLAYER: 'INIT_PLAYER',
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  SET_VOLUME: 'SET_VOLUME',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME'
};

// Reducer Function
const playerReducer = (state, action) => {
  const { playerId, type, payload } = action;

  switch (type) {
    case PlayerActionTypes.INIT_PLAYER:
      return {
        ...state,
        [playerId]: {
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          volume: payload.volume || 1,
          ...payload
        }
      };

    case PlayerActionTypes.PLAY:
      return {
        ...state,
        [playerId]: { ...state[playerId], isPlaying: true }
      };

    case PlayerActionTypes.PAUSE:
      return {
        ...state,
        [playerId]: { ...state[playerId], isPlaying: false }
      };

    case PlayerActionTypes.SET_VOLUME:
      return {
        ...state,
        [playerId]: { ...state[playerId], volume: payload }
      };

    case PlayerActionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        [playerId]: { ...state[playerId], currentTime: payload }
      };

    default:
      return state;
  }
};

export default playerReducer;
