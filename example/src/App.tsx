import React from 'react';
import PlayerProvider from '../../src/provider';
import { createPlayer } from '../../src/hooks';
import VideoPlayerPreview from './video-player-preview';

const SetupPlayer = () => {
  createPlayer('player-1', { autoplay: false, volume: 0.5 });
  createPlayer('player-2', { autoplay: true, volume: 0.8 });

  return null; // This component is used only to initialize players
};

const App: React.FC = () => {
  return (
    <PlayerProvider>
      <SetupPlayer />
      <VideoPlayerPreview />
    </PlayerProvider>
  );
};

export default App;
