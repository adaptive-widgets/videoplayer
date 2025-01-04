import React, { createRef, useReducer } from 'react';
import playerReducer from './reducer';
import { PlayerRegistryContext } from './context';

const playerRegistry = {};

const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(playerReducer, {});

  const createPlayer = (playerId, config) => {
    if (!playerRegistry[playerId]) {
      playerRegistry[playerId] = { config, state: {}, ref: createRef() };
      dispatch({ type: 'INIT_PLAYER', playerId, payload: config });
    }
    return playerRegistry[playerId];
  };

  const getPlayer = playerId => playerRegistry[playerId];

  return (
    <PlayerRegistryContext.Provider value={{ state, dispatch, createPlayer, getPlayer }}>
      {children}
    </PlayerRegistryContext.Provider>
  );
};

export default PlayerProvider;
