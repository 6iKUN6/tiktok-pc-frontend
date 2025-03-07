import { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Carousel } from 'antd';

import Player from './component/player';

import 'video.js/dist/video-js.css';
import './index.scss';

import { throttle } from '@/utils/debouneAndThrottle';

interface VideoPlayerProps {
  videos: Array<{ id: number; src: string; type: string }>;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const carouselRef = useRef<any>(null);
  const isInteracting = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState<number>(0);

  const handleSlideChange = useCallback((currentSlide: number) => {
    setActiveIndex(currentSlide);
    setIsLoading(true);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = throttle((event: KeyboardEvent) => {
      isInteracting.current = true;
      if (event.key === 'ArrowUp') {
        carouselRef.current?.prev();
      } else if (event.key === 'ArrowDown') {
        carouselRef.current?.next();
      }
    }, 100);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setItemHeight(containerRef.current.clientHeight);
    }
  }, []);

  console.log('itemHeight', itemHeight);
  return (
    <div className="douyin-container" ref={containerRef}>
      <Carousel
        ref={carouselRef}
        vertical
        dots={false}
        afterChange={handleSlideChange}
        className="douyin-carousel"
      >
        {videos.map((video, index) => (
          <div key={video.id} style={{ width: '100%', height: itemHeight }}>
            <div className="video-wrapper" style={{ height: itemHeight, backgroundColor: 'red' }}>
              <div style={{ color: '#fff' }}>{`${index}:${video.src}`}</div>
              {isLoading && index === activeIndex && (
                <div className="loading-animation" style={{ color: '#fff' }}>
                  加载中...
                </div>
              )}
              {/* 外壳套在video组件上，video暴露方法，在外壳控制video的播放，进度条等。外壳可能还需要点赞，评论，分享之类的 */}
              {/* 下面是video组件 */}
              <Player
                id={video.id}
                src={video.src}
                type={video.type}
                isActive={index === activeIndex && isInteracting.current}
                onLoadedData={handleLoadedData}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default VideoPlayer;
