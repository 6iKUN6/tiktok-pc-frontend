import { FC, useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'video.js/dist/video-js.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './index.less';
import { options } from './config';

// 定义VideoPlayerProps接口，用于组件的props类型
interface VideoPlayerProps {
  videos: Array<{ src: string; type: string }>;
}

// 定义Player类型，用于videojs实例
type Player = ReturnType<typeof videojs>;

// VideoPlayer组件定义
const VideoPlayer: FC<VideoPlayerProps> = ({ videos }) => {
  // 当前激活的视频索引
  const [activeIndex, setActiveIndex] = useState(0);
  // 存储视频元素引用的数组
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  // 存储videojs实例的数组
  const [playerInstances, setPlayerInstances] = useState<Array<Player | null>>([]);

  // 初始化videojs实例和清理
  useEffect(() => {
    videos.forEach((video, index) => {
      if (videoRefs.current[index] && !playerInstances[index]) {
        const player = videojs(videoRefs.current[index]!, {
          ...options,
          sources: [video],
          autoplay: index === activeIndex,
          loop: true,
        });
        setPlayerInstances((prev) => {
          const newInstances = [...prev];
          newInstances[index] = player;
          return newInstances;
        });
      }
    });

    // 组件卸载时清理videojs实例
    return () => {
      playerInstances.forEach((player) => {
        if (player) {
          player.dispose();
        }
      });
    };
  }, [videos, activeIndex, playerInstances]);

  // 处理滑动切换事件
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    playerInstances.forEach((player, index) => {
      if (player) {
        if (index === swiper.activeIndex) {
          player.play();
        } else {
          player.pause();
        }
      }
    });
  };

  // 渲染组件
  return (
    <div className="douyin-container">
      <Swiper
        direction="vertical"
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        onSlideChange={handleSlideChange}
        className="douyin-swiper"
      >
        {videos.map((_, index) => (
          <SwiperSlide key={index}>
            <div className="video-wrapper">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="video-js vjs-big-play-centered douyin-video"
              >
                <p className="vjs-no-js">视频无法播放，请升级浏览器或下载插件</p>
              </video>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoPlayer;
