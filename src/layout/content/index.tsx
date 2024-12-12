import { Layout } from 'antd';
import { FC, useCallback, useState } from 'react';

// import VideoPlayer from '@/components/videoPlayer';
import Slide from '@/components/slide';

import './index.scss';
// const videosMock = [
//   {
//     id: 1,
//     src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
//     type: 'video/mp4',
//   },
//   {
//     id: 2,
//     src: 'https://www.w3schools.com/html/movie.mp4',
//     type: 'video/mp4',
//   },
//   {
//     id: 3,
//     src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
//     type: 'video/mp4',
//   },
// ];

const { Content } = Layout;
const ContentComp: FC = () => {
  // const [videos] = useState<Array<{ id: number; src: string; type: string }>>(videosMock);
  const [list] = useState([
    {
      backgroundColor: 'pink',
      text: '1',
    },
    {
      backgroundColor: 'skyblue',
      text: '2',
    },
    {
      backgroundColor: 'yellow',
      text: '3',
    },
    {
      backgroundColor: 'green',
      text: '4',
    },
    {
      backgroundColor: 'blue',
      text: '5',
    },
    {
      backgroundColor: 'purple',
      text: '6',
    },
  ]);

  const renderFn = useCallback((item: any, index: number, play: boolean, uniqueId: string) => {
    // console.log('renderFn', item, index, play, uniqueId);
    return (
      <div
        key={uniqueId}
        style={{ width: '100%', height: '100%', backgroundColor: item.backgroundColor }}
      >
        {item.text}
      </div>
    );
  }, []);
  // const [index, setIndex] = useState<number>(0);//这个index需要和外部双向绑定
  return (
    <Content className="content-box">
      <div className="body">
        {/* <VideoPlayer videos={videos} /> */}
        <Slide
          name="slide-comp"
          list={list}
          onLoadMore={() => {
            console.log('onLoadMore');
          }}
          uniqueId={'1'}
          index={0}
          render={renderFn}
        ></Slide>
      </div>
    </Content>
  );
};

export default ContentComp;
