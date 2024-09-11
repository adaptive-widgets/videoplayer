import React from 'react';
import videos from './assets/output.webm';

import { VideoPlayer } from '../../src/components';

const App: React.FC = () => {
  return (
    <>
      <div>
        <div style={{ width: '40%' }}>
          <VideoPlayer videoSrc={videos} videoId="1" autoplay={true} />
        </div>
        <div style={{ width: '40%' }}>
          <VideoPlayer videoSrc={videos} videoId="2" />
        </div>
        <div style={{ width: '40%' }}>
          <VideoPlayer videoSrc={videos} videoId="3" />
        </div>
        <div style={{ width: '40%' }}>
          <VideoPlayer videoSrc={videos} videoId="4" />
        </div>
      </div>
    </>
  );
};

export default App;
