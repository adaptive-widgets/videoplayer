import { createContext } from 'react';
import React from 'react';
import { PlayersState, PlayerAction, InitPlayerPayload } from './reducer';

export interface PlayerRegistryEntry {
  config: InitPlayerPayload;
  state: Partial<PlayersState[string]>;
  ref: React.RefObject<HTMLAudioElement>;
}

export interface PlayerRegistryContextType {
  state: PlayersState;
  dispatch: React.Dispatch<PlayerAction>;
  createPlayer: (playerId: string, config: InitPlayerPayload) => PlayerRegistryEntry;
  getPlayer: (playerId: string) => PlayerRegistryEntry | undefined;
}

// Create the context with type or undefined (for initial empty value)
export const PlayerRegistryContext = createContext<PlayerRegistryContextType | undefined>(undefined);
