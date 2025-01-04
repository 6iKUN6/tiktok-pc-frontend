import { FC, memo, useContext } from 'react';

import VideoCtx from '@/utils/ctx/video';

import './index.scss';

interface ItemDescProps {
  isMy: boolean;
  isLive: boolean;
  [key: string]: unknown;
}

const ItemDesc: FC<ItemDescProps> = memo(() => {
  const videoCtx = useContext(VideoCtx);
  console.log('ctx-desc', videoCtx);

  return <div>ItemDesc</div>;
});

export default ItemDesc;
