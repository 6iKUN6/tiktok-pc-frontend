import { createContext } from 'react';

import { NormalObject } from '@/types';

export interface ProvideValue {
  isPlaying: boolean;
  mute: boolean;
  position: NormalObject;
  item: NormalObject;
}

const VideoCtx = createContext<ProvideValue>({
  isPlaying: false,
  mute: false,
  position: {},
  item: {},
});
export default VideoCtx;
