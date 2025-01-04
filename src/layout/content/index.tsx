import { Layout } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

// import VideoPlayer from '@/components/videoPlayer';
import Slide from '@/components/slide';
import './index.scss';
import { getRecommendedVideos } from '@/services/apis';
import { slideItemRender } from '@/utils';

// import { HttpStatus } from '@/utils/constant';

const { Content } = Layout;

const ContentComp: FC = () => {
  // const TestRender: any = ({ backgroundColor, url }: any) => (
  //   <div style={{ backgroundColor, width: '100%', height: '100%' }}>
  //     <video src={url}></video>
  //   </div>
  // );

  const [list, setList] = useState([]);
  const pageStateRef = useRef({
    pageNo: 1,
    pageSize: 10,
    totalSize: 0,
    currentSize: 0,
  });

  const render = slideItemRender({});

  const getData = useCallback(function getData(refresh = false) {
    const { totalSize, pageNo, pageSize, currentSize } = pageStateRef.current;
    if (!refresh && totalSize === currentSize) return;
    getRecommendedVideos({
      page: pageNo,
      pageSize: pageSize,
    }).then((res) => {
      // console.log('res', res);
      if (res.success) {
        setList((prevState) => prevState.concat(res.data.list));
      } else {
        console.error('request error:', res.success);
      }
    });
  }, []);

  useEffect(() => {
    pageStateRef.current.currentSize = list.length;
  }, [list.length]);

  useEffect(() => {
    getData(true);
  }, [getData]);

  const [index, setIndex] = useState<number>(0); //这个index需要和外部双向绑定

  function updateIndex(newIndex: number) {
    setIndex(newIndex);
  }

  return (
    <Content className="content-box">
      <div className="body">
        {/* <VideoPlayer videos={videos} /> */}
        <Slide
          name="slide-comp"
          list={list}
          onLoadMore={() => {}}
          uniqueId={'ikun'}
          index={index}
          render={render}
          updateIndex={updateIndex}
        ></Slide>
      </div>
    </Content>
  );
};

export default ContentComp;
