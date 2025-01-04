// import { _duration } from '@/utils';
// import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';

// interface ProgressState {
//   duration: number;
//   currentTime: number;
//   step: number;
//   playX: number;
//   start: { x: number };
//   last: { x: number; time: number };
// }

// interface ProgressBarRect {
//   height: number;
//   width: number;
// }

// const Progress: FC<{ isMove: boolean; isPlaying: boolean }> = ({ isMove, isPlaying }) => {
//   const progressEl = useRef<HTMLDivElement | null>(null);

//   const [progressState, setProgressState] = useState<ProgressState>({
//     currentTime: 0,
//     duration: 0,
//     step: 0,
//     playX: 0,
//     start: { x: 0 },
//     last: { x: 0, time: 0 },
//   });
//   useEffect(() => {
//     console.log('progressState', progressState);
//   }, [progressState]);

//   const progressBarRect = useRef<ProgressBarRect>({
//     height: 0,
//     width: 0,
//   });

//   const isShowProgressLine = useMemo<boolean>(
//     () => progressState.duration > 15 || isMove || !isPlaying,
//     [progressState.duration, isMove, isPlaying],
//   );

//   const durationStyle = useMemo(() => {
//     return { width: progressState.playX + 'px' };
//   }, [progressState.playX]);

//   const progressClass = useMemo<string>(() => {
//     if (isMove) {
//       return 'move';
//     } else {
//       return isPlaying ? '' : 'stop';
//     }
//   }, [isMove, isPlaying]);

//   const touchEnd = () => {};

//   const touchMove = () => {};

//   const touchStart = () => {};

//   return (
//     <div
//       className={`progress ${progressClass}`}
//       ref={progressEl}
//       onTouchMove={touchMove}
//       onTouchEnd={touchEnd}
//       onTouchStart={touchStart}
//     >
//       {isMove && (
//         <div className="time">
//           <span className="currentTime">{_duration(progressState.currentTime)}</span>
//           {'/'}
//           <span className="duration">{_duration(progressState.duration)}</span>
//         </div>
//       )}
//       {isShowProgressLine && (
//         <Fragment>
//           <div className="bg"></div>
//           <div className="progress-line" style={durationStyle}></div>
//           <div className="point"></div>
//         </Fragment>
//       )}
//     </div>
//   );
// };

// export default Progress;
