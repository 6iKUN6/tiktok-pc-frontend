import { FC, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface PlayerProps {
  id: number;
  src: string;
  type: string;
  isActive: boolean;
  onLoadedData?: () => void;
}

const Player: FC<PlayerProps> = ({ id, src, type, isActive, onLoadedData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const player = videojs(videoRef.current, {
      sources: [{ src, type }],
      autoplay: isActive,
      loop: true,
      controls: true,
      fluid: true,
      aspectRatio: '16:9',
      preload: 'auto',
    });

    player.on('loadeddata', () => {
      onLoadedData?.();
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, type, isActive, onLoadedData]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isActive) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
      playerRef.current.reset();
    }
  }, [isActive]);

  return (
    <div data-vjs-player style={{ width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered douyin-video"
        style={{ objectFit: 'cover' }}
        id={`video-${id}`}
      >
        <source src={src} type={type} />
        <p className="vjs-no-js">视频无法播放，请升级浏览器或下载插件</p>
      </video>
    </div>
  );
};

export default Player;
