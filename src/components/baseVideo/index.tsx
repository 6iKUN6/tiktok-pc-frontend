import { FC, useMemo, useRef, useState, Fragment, useEffect, memo, useCallback } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';

import VideoCtx, { ProvideValue } from '@/utils/ctx/video';
import Loading from '@/components/Loading/index';
import ItemToolbar from '@/components/itemToolbar';
import ItemDesc from '@/components/itemDesc';
import type { NormalObject } from '@/types';
import { SlideVideoPlayStatus } from '@/utils/constant';
import { _checkImgUrl, _duration, _stopPropagation } from '@/utils';
import bus, { EVENT_KEY, EVENT_KEY_TYPE } from '@/utils/bus';

import './index.scss';

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

  isMove: boolean;
  // ignoreWaiting: boolean;
  test: number[];
  localItem?: NormalObject;

  // videoScreenHeight: number;
  commentVisible: boolean;
}

interface ProgressState {
  duration: number;
  currentTime: number;
  step: number;
  playX: number;
  start: { x: number };
  last: { x: number; time: number };
}

interface ProgressBarRect {
  height: number;
  width: number;
}

interface ClientSize {
  height: number;
  width: number;
}

const BaseVideo: FC<BaseVideoProps> = memo(
  ({ item = {}, position = {}, isPlay = true, isMy = false, isLive = false }) => {
    const videoWrapper = useRef<HTMLDivElement | null>(null);
    const videoEl = useRef<HTMLVideoElement | null>(null);
    const progressEl = useRef<HTMLDivElement | null>(null);

    // console.log('basevideo');

    const [state, setState] = useState<VideoState>({
      loading: false,
      mute: window.isMuted,
      paused: false,
      status: isPlay ? SlideVideoPlayStatus.PLAY : SlideVideoPlayStatus.PAUSE,

      isMove: false,
      // ignoreWaiting: false, //忽略waiting事件
      test: [1, 2],
      localItem: item,

      // videoScreenHeight: 0,
      commentVisible: false,
    });

    const [progressState, setProgressState] = useState<ProgressState>({
      currentTime: 0,
      duration: 0,
      step: 0,
      playX: 0,
      start: { x: 0 },
      last: { x: 0, time: 0 },
    });

    // console.log('basevideo');
    // useEffect(() => {
    //   console.log('progressState', progressState);
    // }, [progressState]);
    // useEffect(() => {
    //   console.log('state', state);
    // }, [state]);

    const ignoreWaiting = useRef<boolean>(false); //忽略waiting事件

    const progressBarRect = useRef<ProgressBarRect>({
      height: 0,
      width: 0,
    });

    const clientSize = useRef<ClientSize>({
      height: 0,
      width: 0,
    });

    const videoScreenHeight = useRef<number>(0);

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
      () => progressState.duration > 15 || state.isMove || !isPlaying,
      [progressState.duration, state.isMove, isPlaying],
    );

    const durationStyle = useMemo(() => {
      return { width: progressState.playX + 'px' };
    }, [progressState.playX]);

    const progressClass = useMemo<string>(() => {
      if (state.isMove) {
        return 'move';
      } else {
        return isPlaying ? '' : 'stop';
      }
    }, [state.isMove, isPlaying]);

    const provide = useMemo<ProvideValue>(() => {
      return {
        isPlaying,
        mute: state.mute,
        position: position,
        item: item || {},
      };
    }, [state.mute, isPlaying, position, item]);
    useEffect(() => {
      console.log('state.mute', state.mute);
    }, [state.mute]);

    useEffect(() => {
      const h = document.body.clientHeight;
      const w = document.body.clientWidth;

      clientSize.current.height = h;
      clientSize.current.width = w;

      const fun = (e: Event) => {
        const target = e.target as HTMLVideoElement;

        setProgressState((prevState) => ({
          ...prevState,
          currentTime: Math.ceil(target.currentTime),
          playX: prevState.step * (prevState.currentTime - 1),
        }));
      };

      if (videoEl.current) {
        videoEl.current.currentTime = 0;

        videoEl.current.addEventListener('loadedmetadata', () => {
          videoEl.current?.addEventListener('timeupdate', fun);

          progressBarRect.current.height = (videoEl.current as HTMLVideoElement).offsetHeight;
          progressBarRect.current.width = (videoEl.current as HTMLVideoElement).offsetWidth;

          videoScreenHeight.current = videoEl.current
            ? videoEl.current.videoHeight / (videoEl.current.videoWidth / clientSize.current.width)
            : 0;

          setProgressState((prevState) => ({
            ...prevState,
            duration: Math.ceil((videoEl.current as HTMLVideoElement).duration),
            step:
              progressBarRect.current.width /
              Math.floor((videoEl.current as HTMLVideoElement).duration),
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
              if (!prevState.paused && !ignoreWaiting.current) {
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

    /**
     * 移除静音状态
     */
    const removeMuted = useCallback(function () {
      console.log('removeMuted');

      setState((prevState) => ({
        ...prevState,
        mute: false,
      }));
    }, []);

    /**
     * 打开字幕类型
     */
    const onOpenSubType = useCallback(function () {
      setState((prevState) => ({
        ...prevState,
        commentVisible: true,
      }));
    }, []);

    /**
     * 关闭字幕类型
     */
    const onCloseSubType = useCallback(function () {
      setState((prevState) => ({
        ...prevState,
        commentVisible: false,
      }));
    }, []);

    /**
     * 对话框移动
     * @param {Object} params - 移动参数
     * @param {string} params.tag - 标签
     * @param {string} params.e - 移动距离
     */
    const onDialogMove = useCallback(
      function ({ tag, e }: { tag: string; e: string }) {
        if (state.commentVisible && tag === 'comment' && videoEl.current) {
          videoEl.current.style.transitionDuration = `0ms`;
          videoEl.current.style.height = `calc(var(--vh, 1vh) * 30 + ${e}px)`;
        }
      },
      [state.commentVisible],
    );

    /**
     * 对话框移动结束
     * @param {Object} params - 结束参数
     * @param {string} params.tag - 标签
     * @param {boolean} params.isClose - 是否关闭
     */
    const onDialogEnd = useCallback(
      function ({ tag, isClose }: { tag: string; isClose: boolean }) {
        if (state.commentVisible && tag === 'comment') {
          videoEl.current!.style.transitionDuration = `300ms`;
          if (isClose) {
            setState((prevState) => ({
              ...prevState,
              commentVisible: false,
            }));
            videoEl.current!.style.height = `100%`;
          } else {
            videoEl.current!.style.height = `calc(var(--vh, 1vh) * 30)`;
          }
        }
      },
      [state.commentVisible],
    );

    /**
     * 打开评论
     * @param {string} id - 视频ID
     */
    const onOpenComments = useCallback(
      function (id: string) {
        if (id === item!.aweme_id) {
          videoEl.current!.style.transitionDuration = `300ms`;
          videoEl.current!.style.height = `calc(var(--vh, 1vh) * 30)`;
          setState((prevState) => ({
            ...prevState,
            commentVisible: true,
          }));
        }
      },
      [item],
    );

    /**
     * 关闭评论
     */
    const onCloseComments = useCallback(
      function () {
        if (state.commentVisible) {
          videoEl.current!.style.transitionDuration = `300ms`;
          videoEl.current!.style.height = `100%`;
          setState((prevState) => ({
            ...prevState,
            commentVisible: false,
          }));
        }
      },
      [state.commentVisible],
    );

    /**
     * 点击事件处理
     * @param {Object} params - 点击参数
     * @param {string} params.uniqueId - 唯一ID
     * @param {string} params.index - 索引
     * @param {string} params.type - 事件类型
     */
    const click = useCallback(
      function ({
        uniqueId,
        index,
        type,
      }: {
        uniqueId: string;
        index: string;
        type: EVENT_KEY_TYPE;
      }) {
        // console.log('click', uniqueId, index, type);
        if (position.uniqueId === uniqueId && position.index === index) {
          if (type === EVENT_KEY.ITEM_TOGGLE) {
            if (isLive) {
              pause();
              // 跳转直播路由
              bus.emit(EVENT_KEY.NAV, {
                path: '/home/live',
                query: { id: item.aweme_id },
              });
            } else {
              if (state.status === SlideVideoPlayStatus.PLAY) {
                pause();
              } else {
                play();
              }
            }
          }

          if (type === EVENT_KEY.ITEM_STOP) {
            videoEl.current!.currentTime = 0;
            ignoreWaiting.current = true;
            pause();
            setTimeout(() => {
              ignoreWaiting.current = false;
            }, 300);
          }

          if (type === EVENT_KEY.ITEM_PLAY) {
            videoEl.current!.currentTime = 0;
            setState((prevState) => ({
              ...prevState,
              ignoreWaiting: true,
            }));
            ignoreWaiting.current = true;
            play();
            setTimeout(() => {
              ignoreWaiting.current = false;
            }, 300);
          }
        }
      },
      [isLive, position.index, position.uniqueId, state.status, item.aweme_id],
    );

    /**
     * 播放视频
     */
    function play() {
      setState((prevState) => ({
        ...prevState,
        status: SlideVideoPlayStatus.PLAY,
      }));
      if (videoEl.current) {
        videoEl.current.volume = 1;
        videoEl.current.play();
        console.log('play-called');
      }
    }

    /**
     * 暂停视频
     */
    function pause() {
      setState((prevState) => ({
        ...prevState,
        status: SlideVideoPlayStatus.PAUSE,
      }));
      if (videoEl.current) {
        videoEl.current.pause();
        console.log('pause-called');
      }
    }

    useEffect(() => {
      //埋线
      bus.on(EVENT_KEY.SINGLE_CLICK_BROADCAST, click);
      bus.on(EVENT_KEY.DIALOG_MOVE, onDialogMove);
      bus.on(EVENT_KEY.DIALOG_END, onDialogEnd);
      bus.on(EVENT_KEY.OPEN_COMMENTS, onOpenComments);
      bus.on(EVENT_KEY.CLOSE_COMMENTS, onCloseComments);
      bus.on(EVENT_KEY.OPEN_SUB_TYPE, onOpenSubType);
      bus.on(EVENT_KEY.CLOSE_SUB_TYPE, onCloseSubType);
      bus.on(EVENT_KEY.REMOVE_MUTED, removeMuted);
      return () => {
        //组件卸载时要关闭部分事件
        bus.off(EVENT_KEY.SINGLE_CLICK_BROADCAST, click);
        bus.off(EVENT_KEY.DIALOG_MOVE, onDialogMove);
        bus.off(EVENT_KEY.DIALOG_END, onDialogEnd);
        bus.off(EVENT_KEY.OPEN_COMMENTS, onOpenComments);
        bus.off(EVENT_KEY.CLOSE_COMMENTS, onCloseComments);
        bus.off(EVENT_KEY.OPEN_SUB_TYPE, onOpenSubType);
        bus.off(EVENT_KEY.CLOSE_SUB_TYPE, onCloseSubType);
        bus.off(EVENT_KEY.REMOVE_MUTED, removeMuted);
      };
    }, [
      click,
      onCloseComments,
      onCloseSubType,
      onDialogEnd,
      onDialogMove,
      onOpenComments,
      onOpenSubType,
      removeMuted,
    ]);

    function touchStart(e: React.TouchEvent<HTMLDivElement>) {
      _stopPropagation(e.nativeEvent);
      // setState((prevState) => ({
      //   ...prevState,
      //   start: { x: e.touches[0].pageX },
      //   last: { x: prevState.playX, time: prevState.currentTime },
      // }));
      setProgressState((prevState) => ({
        ...prevState,
        start: { x: e.touches[0].pageX },
        last: { x: prevState.playX, time: prevState.currentTime },
      }));
    }

    function touchMove(e: React.TouchEvent<HTMLDivElement>) {
      _stopPropagation(e.nativeEvent);
      setState((prevState) => ({ ...prevState, isMove: true }));
      pause();
      const dx = e.touches[0].pageX - progressState.start.x;

      // 确保在合理范围
      let newCurrentTime = progressState.last.time + Math.ceil(Math.ceil(dx) / progressState.step);

      if (newCurrentTime > progressState.duration) {
        newCurrentTime = progressState.duration;
      }

      if (newCurrentTime < 0) {
        newCurrentTime = 0;
      }

      // setState((prevState) => ({
      //   ...prevState,
      //   playX: prevState.last.x + dx,
      //   currentTime: newCurrentTime,
      // }));
      setProgressState((prevState) => ({
        ...prevState,
        playX: prevState.last.x + dx,
        currentTime: newCurrentTime,
      }));
    }

    function touchEnd(e: React.TouchEvent<HTMLDivElement>) {
      _stopPropagation(e.nativeEvent); //传递原生事件
      if (isPlaying) return;
      // setTimeout(() => {}, 1000);
      setState((prevState) => ({
        ...prevState,
        isMove: false,
      }));
      if (videoEl.current) {
        videoEl.current.currentTime = progressState.currentTime;
      }

      play();
    }

    return (
      <VideoCtx.Provider value={provide}>
        <div className={`video-wrapper ${positionName}`} ref={videoWrapper}>
          {state.loading && <Loading style={{ position: 'absolute' }} />}
          <video
            className="video"
            ref={videoEl}
            autoPlay={isPlay}
            poster={poster}
            muted={state.mute}
            loop
            preload="true"
            playsInline={true}
            webkit-playsinline={'true'}
            x5-video-player-type="h5-page"
            x5-video-player-fullscreen="false"
            x5-playsinline={'true'}
          >
            {item &&
              item.video.play_addr.url_list.map((urlItem: string, index: number) => (
                <source key={index} src={urlItem} type="video/mp4" />
              ))}
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
                  {!state.commentVisible && (
                    <Fragment>
                      <ItemToolbar isMy={isMy} item={item} />
                      <ItemDesc isMy={isMy} isLive={isLive} />
                    </Fragment>
                  )}
                  {isMy && (
                    <div className="comment-status">
                      <div className="comment">
                        <div className="type-comment">
                          <img className="avatar" src="src/assets/img/head-image.jpeg" alt="ikun" />
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
                  {state.isMove && (
                    <div className="time">
                      <span className="currentTime">{_duration(progressState.currentTime)}</span>
                      {'/'}
                      <span className="duration">{_duration(progressState.duration)}</span>
                    </div>
                  )}
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
  },
);

export default BaseVideo;
