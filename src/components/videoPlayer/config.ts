//controlBar的基本配置
// const controlBar = {
//   playToggle: true, // 播放暂停按钮
//   volumePanel: true,
//   currentTimeDisplay: true,
//   timeDivider: true,
//   durationDisplay: true,
//   progressControl: true,
//   liveDisplay: true,
//   seekToLive: true,
//   remainingTimeDisplay: true,
//   customControlSpacer: true,
//   playbackRateMenuButton: [0.5, 1, 1.5, 2],
//   chaptersButton: true,
//   descriptionsButton: true,
//   subsCapsButton: true,
//   audioTrackButton: true,
//   fullscreenToggle: true,
// };

// 写了 children 配置后，完全就按 children 的配置走。前面的 true 和 false 都没用了
export const options = {
  controls: true,
  preload: 'auto',
  language: 'zh-CN',
  width: 854,
  height: 480,
  playbackRates: [0.5, 0.75, 1, 1.5, 2], // 倍速数组
  controlBar: {
    children: {
      PlayToggle: true,
      CurrentTimeDisplay: true,
      DurationDisplay: true,
      ProgressControl: true,
      Quality: true,
      PlaybackRateMenuButton: true,
      volumePanel: {
        inline: false,
      },
      PictureInPictureToggle: true,
      FullscreenToggle: true,
    },
  },
};
