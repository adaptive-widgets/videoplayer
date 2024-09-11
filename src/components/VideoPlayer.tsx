import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoPlayer.css'; // Ensure you have corresponding CSS

interface IVideoPlayer {
  videoSrc: string;
  poster?: string;
  videoId: string; // Unique identifier for each video
  autoplay?: boolean;
}

const VideoPlayer: React.FC<IVideoPlayer> = ({
  videoSrc,
  poster,
  videoId,
  autoplay
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [totalTime, setTotalTime] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');
  const [volumeLevel, setVolumeLevel] = useState<'high' | 'low' | 'muted'>(
    'high'
  );
  const [previewImgSrc, setPreviewImgSrc] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [fullScreen, setFullScreen] = useState(false); // Corrected initial value

  const formatDuration = useCallback((time: number): string => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2
    });

    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`;
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      setVolumeLevel(newMutedState ? 'muted' : volume >= 0.5 ? 'high' : 'low');
      video.muted = newMutedState;
      if (newMutedState) {
        setVolume(0); // Set volume to 0 when muted
      } else {
        setVolume(video.volume); // Restore volume if unmuting
      }
    }
  }, [isMuted, volume]);

  const changePlaybackSpeed = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      // Define playback rates in an array
      const playbackRates = [0.25, 0.5, 1, 1.5, 2];
      const newPlaybackRate: number =
        playbackRates[
          (playbackRates.indexOf(playbackRate) + 1) % playbackRates.length
        ];
      setPlaybackRate(newPlaybackRate);
      video.playbackRate = newPlaybackRate;
    }
  }, [playbackRate]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      if (videoRef.current) {
        videoRef.current.volume = value;
        if (value === 0) {
          setIsMuted(true);
          setVolumeLevel('muted');
        } else {
          setIsMuted(false);
          setVolumeLevel(value >= 0.5 ? 'high' : 'low');
        }
      }
    },
    []
  );

  const handleTimelineMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isScrubbing) {
        const rect = timelineRef.current?.getBoundingClientRect();
        if (rect) {
          const percent =
            Math.min(Math.max(0, e.clientX - rect.left), rect.width) /
            rect.width;
          const previewImgNumber = Math.max(
            1,
            Math.floor((percent * videoRef.current!.duration) / 10)
          );
          setPreviewImgSrc(`assets/previewImgs/preview${previewImgNumber}.jpg`);
          if (timelineRef.current) {
            timelineRef.current.style.setProperty(
              '--preview-position',
              percent.toString()
            );
          }
        }
      }
    },
    [isScrubbing]
  );

  const handleTimelineMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (rect) {
        const percent =
          Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
        const video = videoRef.current;
        if (video) {
          video.currentTime = percent * video.duration;
          video.pause(); // Pause when clicking on the timeline
        }
        setIsScrubbing(true);
      }
    },
    []
  );

  const handleTimelineMouseUp = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play(); // Start playing after the click
    }
    setIsScrubbing(false);
    setIsPlaying(true);
  }, []);

  const handleTimelineMouseLeave = useCallback(() => {
    setIsScrubbing(false);
  }, []);

  const toggleFullScreenMode = useCallback(() => {
    console.log(document.fullscreenElement, 'full screen');
    if (document.fullscreenElement == null) {
      setFullScreen(true);
      videoRef.current?.parentElement?.requestFullscreen();
    } else {
      setFullScreen(false);
      document.exitFullscreen();
    }
  }, []);

  const toggleTheaterMode = useCallback(() => {
    videoRef.current?.parentElement?.classList.toggle('theater');
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    console.log(video);
    const storageKey = `videoCurrentTime-${videoId}`; // Use unique key for each video

    if (video) {
      const updateTime = () => {
        const duration = video.duration;
        const currentTime = video.currentTime;
        setTotalTime(formatDuration(duration));
        setCurrentTime(formatDuration(currentTime));
        console.log(currentTime, 'time');

        // Save currentTime to localStorage with a unique key
        localStorage.setItem(storageKey, currentTime.toString());

        const percent = currentTime / duration;
        if (timelineRef.current) {
          timelineRef.current.style.setProperty(
            '--progress-position',
            percent.toString()
          );
        }
      };

      const handleEnded = () => {
        setIsPlaying(false); // Set isPlaying to false when video ends
      };

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadeddata', () => {
        const savedTime = parseFloat(localStorage.getItem(storageKey) || '0');
        video.currentTime = savedTime;
        setTotalTime(formatDuration(video.duration));
      });
      video.addEventListener('ended', handleEnded); // Add ended event listener

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('ended', handleEnded); // Clean up event listener
      };
    }
  }, [formatDuration, videoId]);

  useEffect(() => {
    if (volume === 0) {
      setIsMuted(true);
      setVolumeLevel('muted');
    } else if (volume >= 0.5) {
      setIsMuted(false);
      setVolumeLevel('high');
    } else {
      setIsMuted(false);
      setVolumeLevel('low');
    }
  }, [volume]);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     // e.preventDefault();
  //     const tagName = (e.target as HTMLElement).tagName.toLowerCase();
  //     if (tagName === "button") return; // Prevent actions if focus is on a button

  //     switch (e.key.toLowerCase()) {
  //       case " ":
  //         if (tagName === "button") return;
  //         break; // Ignore space if focused on a button
  //       case "k":
  //         togglePlay();
  //         break;
  //       case "f":
  //         toggleFullScreenMode();
  //         break;
  //       case "t":
  //         toggleTheaterMode();
  //         break;
  //       case "m":
  //         toggleMute();
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [togglePlay, toggleFullScreenMode, toggleTheaterMode, toggleMute]);

  return (
    <div
      className={`video-container ${!isPlaying ? 'paused' : ''} ${
        fullScreen ? 'open' : 'close'
      }`}
      data-volume-level={volumeLevel}
    >
      <img className="thumbnail-img" src={previewImgSrc} alt="Thumbnail" />
      <div className="video-controls-container">
        <div
          className="timeline-container"
          ref={timelineRef}
          onMouseMove={handleTimelineMouseMove}
          onMouseDown={handleTimelineMouseDown}
          onMouseUp={handleTimelineMouseUp}
          onMouseLeave={handleTimelineMouseLeave}
        >
          <div className="timeline">
            <div className="thumb-indicator"></div>
          </div>
        </div>
        <div className="controls">
          <button className="play-pause-btn" onClick={togglePlay}>
            {isPlaying ? (
              <svg className="pause-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
              </svg>
            ) : (
              <svg className="play-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            )}
          </button>

          <div className="volume-container">
            <button className="mute-btn" onClick={toggleMute}>
              {volumeLevel === 'muted' ? (
                <svg className="volume-muted-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                  />
                </svg>
              ) : volumeLevel === 'low' ? (
                <svg className="volume-low-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                  />
                </svg>
              ) : (
                <svg className="volume-high-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                  />
                </svg>
              )}
            </button>

            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className="duration-container">
            <div className="current-time">{currentTime}</div>/
            <div className="total-time">{totalTime}</div>
          </div>
          <button className="speed-btn wide-btn" onClick={changePlaybackSpeed}>
            {playbackRate}x
          </button>
          <button className="theater-btn" onClick={toggleTheaterMode}>
            <svg className="tall" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"
              />
            </svg>
            <svg className="wide" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"
              />
            </svg>
          </button>
          <button
            className={`full-screen-btn ${fullScreen ? 'open' : 'close'}`}
            onClick={toggleFullScreenMode}
          >
            {fullScreen ? (
              <svg className="close" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                />
              </svg>
            ) : (
              <svg className="open" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        autoPlay={autoplay}
      ></video>
    </div>
  );
};

export { IVideoPlayer, VideoPlayer };
