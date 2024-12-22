import { Layout } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

// import VideoPlayer from '@/components/videoPlayer';
import Slide from '@/components/slide';
import './index.scss';
import { getRecommendedVideos } from '@/services/apis';
// import { slideItemRender } from '@/utils';
// import { HttpStatus } from '@/utils/constant';

const { Content } = Layout;
const ContentComp: FC = () => {
  const [list2] = useState([
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
    {
      backgroundColor: 'red',
      text: '7',
    },
    {
      backgroundColor: 'orange',
      text: '8',
    },
    {
      backgroundColor: 'brown',
      text: '9',
    },
    {
      backgroundColor: 'grey',
      text: '10',
    },
    {
      backgroundColor: 'black',
      text: '11',
    },
    {
      backgroundColor: 'white',
      text: '12',
    },
    {
      backgroundColor: 'pink',
      text: '13',
    },
    {
      backgroundColor: 'skyblue',
      text: '14',
    },
    {
      backgroundColor: 'yellow',
      text: '15',
    },
    {
      backgroundColor: 'green',
      text: '16',
    },
    {
      backgroundColor: 'blue',
      text: '17',
    },
    {
      backgroundColor: 'purple',
      text: '18',
    },
    {
      backgroundColor: 'red',
      text: '19',
    },
    {
      backgroundColor: 'orange',
      text: '20',
    },
    {
      backgroundColor: 'brown',
      text: '21',
    },
    {
      backgroundColor: 'grey',
      text: '22',
    },
    {
      backgroundColor: 'black',
      text: '23',
    },
    {
      backgroundColor: 'white',
      text: '24',
    },
    {
      backgroundColor: 'pink',
      text: '25',
    },
    {
      backgroundColor: 'skyblue',
      text: '26',
    },
    {
      backgroundColor: 'yellow',
      text: '27',
    },
    {
      backgroundColor: 'green',
      text: '28',
    },
    {
      backgroundColor: 'blue',
      text: '29',
    },
    {
      backgroundColor: 'purple',
      text: '30',
    },
  ]);

  const [list, setList] = useState([]);
  const pageStateRef = useRef({
    pageNo: 1,
    pageSize: 10,
    totalSize: 0,
    currentSize: 0,
  });

  // const render = slideItemRender({});

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
          list={list2}
          onLoadMore={() => {}}
          uniqueId={'ikun'}
          index={index}
          render={({ backgroundColor, text }) => <div style={{ backgroundColor }}>{text}</div>}
          updateIndex={updateIndex}
        ></Slide>
      </div>
    </Content>
  );
};

export default ContentComp;
