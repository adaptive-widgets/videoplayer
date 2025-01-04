# Adaptive Video Player

A lightweight and flexible React video player plugin for seamless video playback and control.

🚀 **Coming Soon!**

---

## Features

- 🎥 Simple API for creating and managing video players.
- 🛠️ Fully customizable with autoplay, volume, and seek options.
- ⚡ Optimized for performance and modern React.

---


## API Reference

### `createPlayer(playerId, config)`

Initialize a new video player.

- **`playerId`** (string): Unique ID for the player.
- **`config`** (object): Configuration options:
  - `autoplay` (boolean): Whether the video should autoplay. Default: `false`.
  - `volume` (number): Initial volume level (0 to 1). Default: `1`.

### `usePlayer(playerId)`

React hook to access and control an existing video player.

- **Returns**:
  - `videoRef`: Ref to the `<video>` element.
  - `isPlaying` (boolean): Current playback state.
  - `play()`: Play the video.
  - `pause()`: Pause the video.
  - `setVolume(volume)`: Adjust the volume.
  - `seekTo(time)`: Seek to a specific time in seconds.

---

## Usage (Preview)

### 1. Setup

Wrap your app with the `PlayerProvider`:

```jsx
import { PlayerProvider } from '@adaptive/videoplayer';

const App = () => (
  <PlayerProvider>
    <YourComponent />
  </PlayerProvider>
);
```

### 2. Create a Player

```jsx
import { createPlayer } from '@adaptive/videoplayer';

createPlayer('player-1', { autoplay: false, volume: 0.5 });
```
### 3. Use the Player

```jsx
import { usePlayer } from '@adaptive/videoplayer';

const VideoPlayer = () => {
  const player = usePlayer('player-1');

  return (
    <div>
      <video ref={player.videoRef} src="video.mp4" />
      <button onClick={player.isPlaying ? player.pause : player.play}>
        {player.isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={player.volume}
        onChange={(e) => player.setVolume(Number(e.target.value))}
      />
    </div>
  );
};
```

---

## License
This project will be licensed under the MIT License.

---

## Roadmap
- 🎥 Add advanced features: subtitles, multiple quality levels, and playback speed control.
- 🌐 Support for internationalization (i18n).
- 🎨 Custom themes for player UI.

