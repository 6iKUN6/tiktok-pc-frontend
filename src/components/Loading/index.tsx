import { FC } from 'react';

import './index.scss';
import { NormalObject } from '@/types';

interface LoadingProp {
  isFullScreen?: boolean;
  type?: 'normal';
  style?: NormalObject;
}

const Loading: FC<LoadingProp> = ({ isFullScreen = true, type = 'normal', style = {} }) => {
  return (
    <div className={`loading ${isFullScreen ? 'full' : 'inline'} ${type}`} style={style}>
      <div className="circle blue"></div>
      <div className="circle red"></div>
    </div>
  );
};

export default Loading;
