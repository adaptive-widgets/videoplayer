import { createContext } from 'react';
import React from 'react';
import { PlayersState, PlayerAction } from './reducer';

// Define the shape of the context
export interface PlayerRegistryContextType {
  state: PlayersState;
  dispatch: React.Dispatch<PlayerAction>;
}

// Create the context with type or undefined (for initial empty value)
export const PlayerRegistryContext = createContext<PlayerRegistryContextType | undefined>(undefined);
