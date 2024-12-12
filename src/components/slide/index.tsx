import React, { FC, ReactNode, useEffect, useRef, useCallback } from 'react';
import './index.scss';
import ReactDOM from 'react-dom/client';

import {
  SlideProps,
  SlideState,
  SlideType,
  slideTouchEnd,
  slideTouchStart,
  canNext,
  slideTouchMove,
  slideReset,
  slideInit,
  getSliceOffset,
} from '@/utils/slide';

//页面中同时存在多少个SliceItem
const itemClassName = 'slide-item';
const appInsMap = new Map<number, ReactDOM.Root>();

const Slide: FC<SlideProps> = ({
  children,
  name,
  index = -1,
  virtualTotal = 5,
  render = () => null,
  list = [],
  onLoadMore,
  uniqueId,
  // active = false,
  // loading = false,
}) => {
  //   const [listState, setListState] = useState(list);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SlideState>({
    judgeValue: 20, //一个用于判断滑动朝向的固定值
    type: SlideType.VERTICAL_INFINITE, //组件类型
    name: name || '',
    localIndex: index, //当前下标
    needCheck: true, //是否需要检测，每次按下都需要检测，up事件会重置为true
    next: false, //能否滑动
    isDown: false, //是否按下，用于move事件判断
    start: { x: 0, y: 0, time: 0 }, //按下时的起点坐标
    move: { x: 0, y: 0 }, //移动时的坐标
    wrapper: { width: 0, height: 0, childrenLength: 0 }, //slide-list的宽度和子元素数量
  });

  useEffect(() => {
    if (wrapperRef.current) {
      console.log(slideInit(wrapperRef.current, stateRef.current));
    }
  }, []);

  useEffect(() => {
    const oldList = stateRef.current.wrapper.childrenLength;
    if (list.length < oldList) {
      stateRef.current.localIndex = 0;
      insertContent();
    } else {
      //没数据就直接插入
      if (oldList === 0) {
        // stateRef.current.wrapper.childrenLength = list.length;
        insertContent();
      } else {
        // 走到这里，说明是通过接口加载了下一页的数据，
        // 为了在用户快速滑动时，无需频繁等待请求接口加载数据，给用户更好的使用体验
        // 这里额外加载3条数据。所以此刻，html里面有原本的5个加新增的3个，一共8个dom
        // 用户往下滑动时只删除前面多余的dom，等滑动到临界值（virtualTotal/2+1）时，再去执行新增逻辑
      }
    }
  }, [list, insertContent]);

  const touchStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    slideTouchStart(e, wrapperRef.current, stateRef.current);
  };

  const touchMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    slideTouchMove(e, wrapperRef.current, stateRef.current, canNext);
  };

  const touchEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    // const isNext = stateRef.current.move.y < 0;
    // if (
    //   stateRef.current.localIndex === 0 &&
    //   !isNext &&
    //   stateRef.current.move.y > baseStore.homeRefresh + baseStore.judgeValue
    // ) {
    //   emit('refresh');
    // }
    slideTouchEnd(e, stateRef.current, canNext, (isNext) => {
      // const half = parseInt((virtualTotal / 2).toString());
      if (list.length > virtualTotal) {
        //手指往上滑(即列表展示下一条视频)
        if (isNext) {
          swipeItem('next');
        } else {
          swipeItem('prev');
        }
        // stateRef.current.wrapper.childrenLength = wrapperRef.current?.children.length || 0;
      }
    });
    //每次滑动结束，重置状态
    slideReset(e, wrapperRef.current, stateRef.current);
  };

  type Option = 'next' | 'prev';

  function swipeItem(option: Option) {
    const half = parseInt((virtualTotal / 2).toString());
    if (option === 'next') {
      //删除最前面的 `dom` ，然后在最后面添加一个 `dom`
      if (
        stateRef.current.localIndex > list.length - virtualTotal &&
        stateRef.current.localIndex > half
      ) {
        onLoadMore?.();
      }

      //是否符合 `腾挪` 的条件
      if (stateRef.current.localIndex > half && stateRef.current.localIndex < list.length - half) {
        //在最后面添加一个 `dom`
        const addItemIndex = stateRef.current.localIndex + half;
        const res = wrapperRef.current?.querySelector(
          `.${itemClassName}[data-index='${addItemIndex}']`,
        );

        if (!res) {
          wrapperRef.current?.appendChild(getInsEl(list[addItemIndex], addItemIndex));
        }

        //删除最前面的 `dom`
        const index = wrapperRef.current
          ?.querySelector(`.${itemClassName}:first-child`)
          ?.getAttribute('data-index');
        appInsMap.get(Number(index))?.unmount();
        wrapperRef.current?.querySelectorAll(`.${itemClassName}`).forEach((item) => {
          (item as HTMLElement).style['top'] =
            (stateRef.current.localIndex - half) * stateRef.current.wrapper.height + 'px';
        });
      }
    } else {
      //删除最后面的 `dom` ，然后在最前面添加一个 `dom`
      if (
        stateRef.current.localIndex >= half &&
        stateRef.current.localIndex < list.length - (half + 1)
      ) {
        const addIndex = stateRef.current.localIndex - half;
        if (addIndex >= 0) {
          const res = wrapperRef.current?.querySelector(
            `.${itemClassName}[data-index='${addIndex}']`,
          );
          if (!res) {
            wrapperRef.current?.appendChild(getInsEl(list[addIndex], addIndex));
          }
        }

        const index = wrapperRef.current
          ?.querySelector(`.${itemClassName}:last-child`)
          ?.getAttribute('data-index');
        appInsMap.get(Number(index))?.unmount();

        wrapperRef.current?.querySelectorAll(`.${itemClassName}`).forEach((item) => {
          (item as HTMLElement).style['top'] =
            (stateRef.current.localIndex - half) * stateRef.current.wrapper.height + 'px';
        });
      }
    }

    stateRef.current.wrapper.childrenLength = wrapperRef.current?.children.length || 0;
  }

  /**
   * 创建并返回一个包含React节点的DOM元素。
   *
   * @param item React节点
   * @param index 元素的索引
   * @param play 是否播放，默认为false
   * @returns 包含React节点的DOM元素
   */
  const getInsEl = useCallback(
    function getInsEl(item: ReactNode, index: number, play: boolean = false) {
      const slideVNode = render(item, index, play, uniqueId!);
      const parent = document.createElement('div');
      parent.className = itemClassName;
      parent.setAttribute('data-index', index.toString());
      const root = ReactDOM.createRoot(parent);
      root.render(slideVNode);
      appInsMap.set(index, root);
      return parent;
      // if (wrapperRef.current) {
      //   const root = ReactDOM.createRoot(wrapperRef.current);
      //   root.render(
      //     <SlideItem data-index={index} key={index} play={play} uniqueId={uniqueId}>
      //       {render(item, index, play, uniqueId!)}
      //     </SlideItem>,
      //   );
      // }
    },
    [render, uniqueId],
  );

  const insertContent = useCallback(
    function () {
      if (!list.length) return;
      //清空wrapperRef
      wrapperRef.current!.innerHTML = '';
      const half = parseInt((virtualTotal / 2).toString()); //虚拟列表的一半
      //因为我们只渲染 virtualTotal 条数据到dom中，并且当前index有可能不是0，所以需要计算出起始下标和结束下标
      let start = 0;
      if (stateRef.current.localIndex > half) {
        start = stateRef.current.localIndex - half;
      }

      let end = start + virtualTotal;
      if (end >= list.length) {
        end = list.length;
        start = end - virtualTotal;
      }

      if (start < 0) start = 0;
      list.slice(start, end).map((item, index) => {
        const el = getInsEl(item, start + index, start + index === stateRef.current.localIndex);
        wrapperRef.current!.appendChild(el);
      });
      //设置偏移量
      if (wrapperRef.current) {
        wrapperRef.current.style['transform'] =
          `translate3d(0px,${getSliceOffset(stateRef.current, wrapperRef.current)}px,  0px)`;
      }

      //因为index有可能不是0，所以要设置Item的top偏移量
      if (stateRef.current.localIndex > 2 && list.length > 5) {
        const list = wrapperRef.current?.querySelectorAll(`.${itemClassName}`);
        list?.forEach((item) => {
          if (list.length - stateRef.current.localIndex > 2) {
            (item as HTMLElement).style['top'] =
              (stateRef.current.localIndex - 2) * stateRef.current.wrapper.height + 'px';
          } else {
            (item as HTMLElement).style['top'] = start * stateRef.current.wrapper.height + 'px';
          }
        });
      }

      stateRef.current.wrapper.childrenLength = wrapperRef.current!.children.length;
      // bus.emit(EVENT_KEY.CURRENT_ITEM, props.list[state.localIndex]);
    },
    [virtualTotal, list, getInsEl],
  );

  //为什么不用Array.prototype.map来生成子元素？，然后操作list来增减item

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowUp') {
      // 上键逻辑
      swipeItem('prev');
    } else if (e.key === 'ArrowDown') {
      // 下键逻辑
      swipeItem('next');
    }
  }

  return (
    <div className="slide slide-infinite">
      <div
        className="slide-list"
        ref={wrapperRef}
        onPointerDown={touchStart}
        onPointerMove={touchMove}
        onPointerUp={touchEnd}
        onKeyUp={handleKeyDown}
      >
        {children}
      </div>
    </div>
  );
};

export default Slide;
