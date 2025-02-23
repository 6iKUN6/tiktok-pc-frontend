import { createContext } from 'react';

import { NormalObject } from '@/types';

interface Item {
  city?: string;
  address?: string;
  author?: {
    nickname?: string;
  };
  desc?: string;
  [key: string]: unknown;
}
export interface ProvideValue {
  isPlaying: boolean;
  mute: boolean;
  position: NormalObject;
  item: Item;
}

const VideoCtx = createContext<ProvideValue>({
  isPlaying: false,
  mute: false,
  position: {},
  item: {},
});
export default VideoCtx;
