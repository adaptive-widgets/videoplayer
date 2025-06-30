import { createContext } from 'react';
import React from 'react';
import { PlayersState, PlayerAction, PlayerState } from './reducer';

// Define the shape of the context
export interface PlayerRegistryContextType {
  state: PlayersState;
  dispatch: React.Dispatch<PlayerAction>;
  createPlayer: (playerId: string, config?: Partial<PlayerState>) => void;
  getPlayer: (playerId: string) => PlayerState | undefined;
}

// Create the context with type or undefined (for initial empty value)
export const PlayerRegistryContext = createContext<PlayerRegistryContextType | undefined>(undefined);
