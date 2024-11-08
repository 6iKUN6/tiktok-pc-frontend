import { FC, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import '@videojs/v7/styles/scss/video-js.scss'; // 引入样式

interface VideoPlayerProps {
  src: string;
  type?: string;
}

type Player = ReturnType<typeof videojs>;

const VideoPlayer: FC<VideoPlayerProps> = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerInstance, setPlayerInstance] = useState<Player | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        sources: [{ src, type }],
      });
      setPlayerInstance(player); // 保存播放器实例

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [src, type]);

  useEffect(() => {
    return () => {
      if (playerInstance) {
        playerInstance.dispose();
      }
    };
  }, [playerInstance]);

  return (
    <div>
      <video
        className="video-js"
        ref={videoRef}
        src={src}
        controls
        preload={'auto'}
        poster=""
        data-setup="{}"
      ></video>
    </div>
  );
};

export default VideoPlayer;
