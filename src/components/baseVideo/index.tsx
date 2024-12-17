import { FC, useMemo, useRef, useState, Fragment, createContext, useEffect } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';

import Loading from '@/components/Loading/index';
import type { NormalObject } from '@/types';
import { SlideVideoPlayStatus } from '@/utils/constant';
import { _checkImgUrl } from '@/utils';

interface BaseVideoProps {
  item?: NormalObject;
  position?: NormalObject;
  isPlay?: boolean; //是否播放
  isMy?: boolean; //是否是我发的视频
  isLive?: boolean; //是否是直播
}

type SlideVideoPlayStatusType = (typeof SlideVideoPlayStatus)[keyof typeof SlideVideoPlayStatus];
interface VideoState {
  loading: boolean;
  mute: boolean; //是否静音
  paused: boolean;
  status: SlideVideoPlayStatusType;
  duration: number;
  currentTime: number;
  step: number;
  playX: number;
  start: { x: number };
  last: { x: number; time: number };
  height: number;
  width: number;
  isMove: boolean;
  ignoreWaiting: boolean;
  test: number[];
  localItem?: NormalObject;
  progressBarRect: {
    height: number;
    width: number;
  };
  videoScreenHeight: number;
  commentVisible: boolean;
}

interface ProvideValue {
  isPlaying: boolean;
  mute: boolean;
  position: NormalObject;
  item: NormalObject;
}

const BaseVideo: FC<BaseVideoProps> = ({
  item,
  position = {},
  isPlay = true,
  isMy = false,
  isLive = false,
}) => {
  const VideoCtx = createContext({});

  const videoWrapper = useRef<HTMLDivElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const progressEl = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<VideoState>({
    loading: false,
    mute: window.isMuted,
    paused: false,
    status: isPlay ? SlideVideoPlayStatus.PLAY : SlideVideoPlayStatus.PAUSE,

    currentTime: 0,
    duration: 0,
    step: 0,
    playX: 0,
    start: { x: 0 },
    last: { x: 0, time: 0 },

    height: 0,
    width: 0,
    isMove: false,
    ignoreWaiting: false, //忽略waiting事件
    test: [1, 2],
    localItem: item,
    progressBarRect: {
      height: 0,
      width: 0,
    },
    videoScreenHeight: 0,
    commentVisible: false,
  });

  //是否播放
  const isPlaying = useMemo<boolean>(() => {
    return state.status === SlideVideoPlayStatus.PLAY;
  }, [state.status]);

  //封面
  const poster = useMemo<string>(() => {
    return item ? _checkImgUrl(item.video.poster ?? item.video.cover.url_list[0]) : '';
  }, [item]);

  const positionName = useMemo<string>(() => {
    return 'item-' + Object.values(position).join('-');
  }, [position]);

  const isShowProgressLine = useMemo<boolean>(
    () => state.duration > 15 || state.isMove || !isPlaying,
    [state.duration, state.isMove, isPlaying],
  );

  const progressClass = useMemo<string>(() => {
    if (state.isMove) {
      return 'move';
    } else {
      return isPlaying ? '' : 'stop';
    }
  }, [state.isMove, isPlaying]);

  const durationStyle = useMemo(() => {
    return { width: state.playX + 'px' };
  }, [state.playX]);

  const provide = useMemo<ProvideValue>(
    () => ({
      isPlaying,
      mute: state.mute,
      position: position,
      item: item || {},
    }),
    [state.mute, isPlaying, position, item],
  );

  useEffect(() => {
    const h = document.body.clientHeight;
    const w = document.body.clientWidth;
    setState((prevState) => ({
      ...prevState,
      height: h,
      width: w,
    }));

    const fun = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      setState((prevState) => ({
        ...prevState,
        currentTime: Math.ceil(target.currentTime),
        playX: prevState.step * (prevState.currentTime - 1),
      }));
    };

    if (videoEl.current) {
      videoEl.current.currentTime = 0;

      videoEl.current.addEventListener('loadedmetadata', () => {
        videoEl.current?.addEventListener('timeupdate', fun);
        setState((prevState) => ({
          ...prevState,
          duration: Math.ceil((videoEl.current as HTMLVideoElement).duration),
          progressBarRect: {
            height: (videoEl.current as HTMLVideoElement).offsetHeight,
            width: (videoEl.current as HTMLVideoElement).offsetWidth,
          },
          step: prevState.progressBarRect.width / Math.floor(prevState.duration),
          videoScreenHeight: videoEl.current
            ? videoEl.current.videoHeight / (videoEl.current.videoWidth / prevState.width)
            : 0,
        }));
      });
    }

    const eventTester = (e: 'playing' | 'waiting', t: string) => {
      videoEl.current?.addEventListener(e, () => {
        if (e === 'playing') {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }

        if (e === 'waiting') {
          setState((prevState) => {
            if (!prevState.paused && !prevState.ignoreWaiting) {
              return {
                ...prevState,
                loading: true,
              };
            } else {
              return prevState;
            }
          });
        }
      });
      console.log(`eventTester:${e}--${t}`);
    };

    eventTester('waiting', '等待数据，并非错误'); //等待数据，并非错误
    eventTester('playing', '开始回放'); //开始回放
  }, []);

  useEffect(() => {
    return () => {
      //组件卸载时要关闭部分事件
    };
  });

  // function play() {
  //   setState((prevState) => ({
  //     ...prevState,
  //     status: SlideVideoPlayStatus.PLAY,
  //   }));
  //   if (videoEl.current) {
  //     videoEl.current.volume = 1;
  //     videoEl.current.play();
  //   }
  // }

  // function pause() {
  //   setState((prevState) => ({
  //     ...prevState,
  //     status: SlideVideoPlayStatus.PAUSE,
  //   }));
  //   if (videoEl.current) {
  //     videoEl.current.pause();
  //   }
  // }

  function touchStart() {}

  function touchMove() {}

  function touchEnd() {}

  return (
    <VideoCtx.Provider value={provide}>
      <div className={`video-wrapper ${positionName}`} ref={videoWrapper}>
        {state.loading && <Loading style={{ position: 'absolute' }} />}
        <video
          src=""
          ref={videoEl}
          autoPlay={isPlay}
          poster={poster}
          muted={state.mute}
          loop
          preload="true"
          playsInline={true}
        >
          <source type="video/mp4" />
          <p>您的浏览器不支持 video 标签。</p>
        </video>
        {!isPlaying && <PlayCircleOutlined className="pause-icon" />}
        <div className="float">
          {isLive ? (
            <Fragment>
              <div className="living">点击进入直播间</div>
            </Fragment>
          ) : (
            <Fragment>
              <div style={{ opacity: state.isMove ? 0 : 1 }} className="normal">
                <>{/*工具栏和详情组件 */}</>
                {isMy && (
                  <div className="comment-status">
                    <div className="comment">
                      <div className="type-comment">
                        <img
                          className="avatar"
                          src={`../../assets/img/head-image.jpeg`}
                          alt="ikun"
                        />
                        <div className="right">
                          <p>
                            <span className="name">杨润才</span>
                            <span className="time">2024-12-12</span>
                          </p>
                          <p className="text">北京</p>
                        </div>
                      </div>
                      <>{/* transition-group */}</>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`progress ${progressClass}`}
                ref={progressEl}
                onTouchMove={touchMove}
                onTouchEnd={touchEnd}
                onTouchStart={touchStart}
              >
                {state.isMove && <div className="time"></div>}
                {isShowProgressLine && (
                  <Fragment>
                    <div className="bg"></div>
                    <div className="progress-line" style={durationStyle}></div>
                    <div className="point"></div>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </VideoCtx.Provider>
  );
};

export default BaseVideo;
