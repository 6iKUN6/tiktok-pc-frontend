import { Layout } from 'antd';
import { FC, useState } from 'react';

import VideoPlayer from '@/components/videoPlayer';

import './index.less';
const videosMock = [
  { src: 'https://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video/mp4' },
  { src: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video/mp4' },
  { src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', type: 'video/mp4' },
];

const { Content } = Layout;
const ContentComp: FC = () => {
  const [videos] = useState<Array<{ src: string; type: string }>>(videosMock);
  return (
    <Content className="content-box">
      <div className="body">
        <VideoPlayer videos={videos} />
      </div>
    </Content>
  );
};

export default ContentComp;
