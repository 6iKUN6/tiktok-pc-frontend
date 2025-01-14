import { Layout } from 'antd';
import { FC, useCallback, useEffect, useRef } from 'react';

import Slide from '@/components/slide';
import './index.scss';
import { getRecommendedVideos } from '@/services/apis';
import { slideItemRender } from '@/utils';
import { useVideoStore } from '@/store';

const { Content } = Layout;

const ContentComp: FC = () => {
  const { list, setList, pageIndex, total, currentSize, setPage } = useVideoStore();
  const isMounted = useRef(false);
  const pagination = useRef({
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    currentSize: 0,
  });
  // useEffect(() => {
  //   console.log('list', list);
  // }, [list]);

  const render = slideItemRender({});

  const getData = useCallback(
    function getData(refresh = false) {
      if (!refresh && total === currentSize) return;
      pagination.current.pageIndex = pageIndex + 1;
      getRecommendedVideos({
        page: pagination.current.pageIndex,
        pageSize: pagination.current.pageSize,
      }).then((res) => {
        if (res.success) {
          const newList = res.data.list;
          // console.log('f-nl:', newList);

          setList(newList);
          pagination.current.total = res.data.total;

          setPage(
            pagination.current.pageSize,
            pagination.current.pageIndex,
            pagination.current.total,
            currentSize + newList.length,
          );
        } else {
          console.error('request error:', res.success);
        }
      });
    },
    [setList, setPage, currentSize, pageIndex, total],
  );

  useEffect(() => {
    //什么沙雕写法，能不能优化(不用isMounted会内存泄漏和死循环)
    if (!isMounted.current) {
      getData(true);
      isMounted.current = true;
    }
  }, [getData]);

  return (
    <Content className="content-box">
      <div className="body">
        <Slide
          name="slide-comp"
          list={list}
          onLoadMore={() => getData()}
          uniqueId={'ikun'}
          render={render}
        ></Slide>
      </div>
    </Content>
  );
};

export default ContentComp;
