import { FC, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import { options } from '../config';

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
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const initPlayer = async () => {
      try {
        const player = videojs(videoRef.current!, options);
        player.on('loadeddata', () => {
          onLoadedData?.();
          setIsPlayerReady(true);
        });
        playerRef.current = player;
      } catch (error) {
        console.error('初始化视频播放器时出错:', error);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          console.error('清理视频播放器时出错:', error);
        }
      }
    };
  }, [src, type, onLoadedData]);

  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    const handlePlay = async () => {
      try {
        await playerRef.current?.play();
      } catch (error) {
        console.error('播放视频时出错:', error);
      }
    };

    if (isActive) {
      handlePlay();
    } else {
      playerRef.current.pause();
      try {
        playerRef.current.currentTime(0);
      } catch (error) {
        console.error('重置视频时出错:', error);
      }
    }
  }, [isActive, isPlayerReady]);

  return (
    <div data-vjs-player style={{ width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered douyin-video"
        style={{ objectFit: 'cover' }}
        id={`video-${id}`}
        preload="metadata"
      >
        <source src={src} type={type} />
        <p className="vjs-no-js">视频无法播放，请升级浏览器或下载插件</p>
      </video>
    </div>
  );
};

export default Player;
