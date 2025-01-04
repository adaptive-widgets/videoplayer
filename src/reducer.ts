// Reducer to manage player states
const playerReducer = (state, action) => {
  const { playerId, type, payload } = action;
  switch (type) {
    case 'INIT_PLAYER':
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
    case 'PLAY':
      return {
        ...state,
        [playerId]: { ...state[playerId], isPlaying: true }
      };
    case 'PAUSE':
      return {
        ...state,
        [playerId]: { ...state[playerId], isPlaying: false }
      };
    case 'SET_VOLUME':
      return {
        ...state,
        [playerId]: { ...state[playerId], volume: payload }
      };
    case 'SET_CURRENT_TIME':
      return {
        ...state,
        [playerId]: { ...state[playerId], currentTime: payload }
      };
    default:
      return state;
  }
};

export default playerReducer;
