import { useContext } from 'react';
import { PlayerRegistryContext } from './context';

// Hook to create a player
export const createPlayer = (playerId, config = {}) => {
  const context = useContext(PlayerRegistryContext);
  if (!context) {
    throw new Error('createPlayer must be used within a PlayerProvider');
  }
  return context.createPlayer(playerId, config);
};

// Hook to use an existing player
export const usePlayer = playerId => {
  const context = useContext(PlayerRegistryContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  const { state, dispatch, getPlayer } = context;
  const player = getPlayer(playerId);

  if (!player) {
    throw new Error(`Player with id "${playerId}" not found.`);
  }

  const play = () => {
    player.ref.current.play();
    dispatch({ type: 'PLAY', playerId });
  };

  const pause = () => {
    player.ref.current.pause();
    dispatch({ type: 'PAUSE', playerId });
  };

  const setVolume = volume => {
    player.ref.current.volume = volume;
    dispatch({ type: 'SET_VOLUME', playerId, payload: volume });
  };

  const seekTo = time => {
    player.ref.current.currentTime = time;
    dispatch({ type: 'SET_CURRENT_TIME', playerId, payload: time });
  };

  return {
    videoRef: player.ref,
    ...state[playerId],
    play,
    pause,
    setVolume,
    seekTo
  };
};
