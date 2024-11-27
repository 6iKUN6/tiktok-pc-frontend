import { Layout } from 'antd';
import { FC, useState } from 'react';

import VideoPlayer from '@/components/videoPlayer';

import './index.scss';
const videosMock = [
  {
    id: 1,
    src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
    type: 'video/mp4',
  },
  {
    id: 2,
    src: 'https://www.w3schools.com/html/movie.mp4',
    type: 'video/mp4',
  },
  {
    id: 3,
    src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4',
  },
];

const { Content } = Layout;
const ContentComp: FC = () => {
  const [videos] = useState<Array<{ id: number; src: string; type: string }>>(videosMock);

  return (
    <Content className="content-box">
      <div className="body">
        <VideoPlayer videos={videos} />
      </div>
    </Content>
  );
};

export default ContentComp;
