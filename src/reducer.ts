// playerReducer.ts

// Player State Type
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  [key: string]: any;
}

// Complete State Type
export type PlayersState = Record<string, PlayerState>;

// Enum for Action Types
export enum PlayerActionTypes {
  INIT_PLAYER = 'INIT_PLAYER',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  SET_VOLUME = 'SET_VOLUME',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME'
}

// Payload Types
interface InitPlayerPayload extends Partial<PlayerState> {}
type VolumePayload = number;
type CurrentTimePayload = number;

// Action Types
type InitPlayerAction = {
  type: PlayerActionTypes.INIT_PLAYER;
  playerId: string;
  payload: InitPlayerPayload;
};

type PlayAction = {
  type: PlayerActionTypes.PLAY;
  playerId: string;
};

type PauseAction = {
  type: PlayerActionTypes.PAUSE;
  playerId: string;
};

type SetVolumeAction = {
  type: PlayerActionTypes.SET_VOLUME;
  playerId: string;
  payload: VolumePayload;
};

type SetCurrentTimeAction = {
  type: PlayerActionTypes.SET_CURRENT_TIME;
  playerId: string;
  payload: CurrentTimePayload;
};

// Union of all Actions
type PlayerAction =
  | InitPlayerAction
  | PlayAction
  | PauseAction
  | SetVolumeAction
  | SetCurrentTimeAction;

// Reducer Function
const playerReducer = (
  state: PlayersState,
  action: PlayerAction
): PlayersState => {
  const { playerId } = action;

  switch (action.type) {
    case PlayerActionTypes.INIT_PLAYER:
      return {
        ...state,
        [playerId]: {
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          volume: action.payload.volume ?? 1,
          ...action.payload
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
        [playerId]: { ...state[playerId], volume: action.payload }
      };

    case PlayerActionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        [playerId]: { ...state[playerId], currentTime: action.payload }
      };

    default:
      return state;
  }
};

export default playerReducer;
