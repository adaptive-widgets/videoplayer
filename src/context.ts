import { createContext, RefObject } from 'react';

// Define the PlayerState interface
export interface PlayerState {
  id: string;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  ref: RefObject<HTMLVideoElement>;
}

// Define the OverallState interface
export interface OverallState {
  [playerId: string]: PlayerState;
}

// Define action types
export type PlayerAction =
  | { type: 'PLAY'; playerId: string }
  | { type: 'PAUSE'; playerId: string }
  | { type: 'SET_VOLUME'; playerId: string; payload: number }
  | { type: 'SET_CURRENT_TIME'; playerId: string; payload: number };

export interface PlayerRegistryContextType {
  state: OverallState;
  dispatch: React.Dispatch<PlayerAction>;
  createPlayer: (playerId: string, config?: Partial<PlayerState>) => void;
  getPlayer: (playerId: string) => PlayerState | undefined;
}

// Context to hold the player registry
export const PlayerRegistryContext = createContext<PlayerRegistryContextType | undefined>(undefined);
