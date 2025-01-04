import { usePlayer } from '../../src/hooks';

const VideoPlayerPreview = () => {
  const player1 = usePlayer('player-1');
  const player2 = usePlayer('player-2');

  return (
    <div>
      <div>
        <h3>Player 1</h3>
        <video ref={player1.videoRef} src="https://www.w3schools.com/html/mov_bbb.mp4" width="600" />
        <button onClick={player1.isPlaying ? player1.pause : player1.play}>
          {player1.isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue={player1.volume}
          onChange={e => player1.setVolume(Number(e.target.value))}
        />
      </div>
      <div>
        <h3>Player 2</h3>
        <video ref={player2.videoRef} src="https://www.w3schools.com/html/movie.mp4" width="600" />
        <button onClick={player2.isPlaying ? player2.pause : player2.play}>
          {player2.isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerPreview;
