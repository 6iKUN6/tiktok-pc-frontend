import { ReactNode } from 'react';

//参考文献https://juejin.cn/post/7361614921519054883
export interface SlideProps {
  children?: ReactNode; //要滚动的页面
  name?: string; //组件名称
  index?: number; //当前下标
  virtualTotal?: number; //页面中同时存在多少个SlideItem
  render?: (item: ReactNode, index: number, play: boolean, uniqueId: string) => ReactNode; //渲染函数
  list: Array<any>; //数据列表
  active?: boolean; //是否激活
  loading?: boolean; //是否加载中
  uniqueId?: string; //唯一ID
  onLoadMore?: () => void; //加载更多
}
export interface SlideState {
  judgeValue: number; //一个用于判断滑动朝向的固定值
  start: { x: number; y: number; time: number }; //按下时的起点坐标
  move: { x: number; y: number }; //移动时的坐标
  wrapper: { width: number; height: number; childrenLength: number }; //slide-list的宽度和子元素数量
  type: SlideType; //组件类型
  name: string; //组件名称
  localIndex: number; //当前下标
  needCheck: boolean; //是否需要检测，每次按下都需要检测，up事件会重置为true
  next: boolean; //能否滑动
  isDown: boolean; //是否按下，用于move事件判断
}
export enum SlideType {
  VERTICAL = 'vertical', //垂直滑动
  HORIZONTAL = 'horizontal', //水平滑动
  VERTICAL_INFINITE = 'vertical_infinite', //垂直无限滑动
}

export function checkEvent(e: any) {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  if (!isMobile || (isMobile && e instanceof PointerEvent)) {
    e.touches = [
      {
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
      },
    ];
  }

  return true;
}

//初始化信息，获取slide dom的长宽、子元素数量，用于move事件判断能否滑动
export function slideInit(el: HTMLDivElement, state: SlideState) {
  // console.log('init-el.style', window.getComputedStyle(el, null)['width']);
  // state.wrapper.width = +el.style.width.replace('px', '');
  // state.wrapper.height = +el.style.height.replace('px', '');
  requestAnimationFrame(() => {
    state.wrapper.width = parseFloat(window.getComputedStyle(el, null)['width']);
    state.wrapper.height = parseFloat(window.getComputedStyle(el, null)['height']);
    state.wrapper.childrenLength = el.children.length;

    //获取偏移量
    const t = getSliceOffset(state, el);
    // console.log('偏移量t', t);
    let dx1 = 0;
    let dx2 = 0;
    if (state.type === SlideType.HORIZONTAL) dx1 = t;
    else dx2 = t;
    el.style.transform = `translate3d(${dx1}px,${dx2}px,0)`;
  });
}

/**
 * 能否继续滑动
 * @param state
 * @param isNext 朝向，向右或向下
 * @returns {boolean}
 */
//检测在对应方向上能否允许滑动，比如SlideHorizontal组件就只处理左右滑动事件，SlideVertical
//只处理上下滑动事件
export function canSlide(state: SlideState): boolean {
  // console.log('canSlide', state);
  // const state = stateRef.current;
  //每次按下都需要检测，up事件会重置为true
  if (state.needCheck) {
    //判断move x和y的距离是否大于判断值，因为距离太小无法判断滑动方向
    if (Math.abs(state.move.x) > state.judgeValue || Math.abs(state.move.y) > state.judgeValue) {
      //放大再相除，根据长宽比判断方向，angle大于1就是左右滑动，小于是上下滑动
      const angle = (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10);
      //根据当前slide的类型，判断能否滑动，并记录下来，后续不再判断，直接返回记录值
      // state = {
      //   ...state,
      //   next: state.type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1,
      //   needCheck: false,
      // };
      state.next = state.type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1;
      state.needCheck = false;
    } else {
      return false;
    }
  }

  return state.next;
}

//slideTouchStart
/**
 * 处理滑动开始事件
 * @param e React.PointerEvent<HTMLDivElement> - 事件对象
 * @param el HTMLDivElement - 滑动容器元素
 * @param state SlideState - 滑动状态对象
 * @returns SlideState - 更新后的滑动状态对象
 */
export function slideTouchStart(
  e: React.PointerEvent<HTMLDivElement>,
  el: HTMLDivElement,
  state: SlideState,
) {
  const { clientX, clientY } = e;
  el.style.transitionDuration = '0ms';
  //记录起点坐标，用于move事件计算移动距离,记录按下时间，用于up事件判断滑动时间
  // state = {
  //   ...state,
  //   start: { x: clientX, y: clientY, time: Date.now() },
  //   isDown: true,
  // };//破案了nmb，不能直接给新对象。。。闭包。。2024.12.12
  state.isDown = true;
  state.start = { x: clientX, y: clientY, time: Date.now() };
  // console.log('slideTouchStart-state', state.isDown);

  return state;
}

export function canNext(state: SlideState, isNext: boolean) {
  return !(
    (state.localIndex === 0 && !isNext) ||
    (state.localIndex === state.wrapper.childrenLength - 1 && isNext)
  );
}

/**
 * 处理滑动移动事件
 * @param e React.PointerEvent<HTMLDivElement> - 事件对象
 * @param el HTMLDivElement - 滑动容器元素
 * @param state SlideState - 滑动状态对象
 * @param canNextCb ((state: SlideState, isNext: boolean) => boolean) | null - 判断是否能继续滑动的回调函数
 * @param notNextCb (() => void) | null - 不能继续滑动时的回调函数
 * @param slideOtherDirectionCb (() => void) | null - 滑动其他方向时的回调函数
 */
export function slideTouchMove(
  e: React.PointerEvent<HTMLDivElement>,
  el: HTMLDivElement,
  state: SlideState,
  canNextCb: ((state: SlideState, isNext: boolean) => boolean) | null = null,
  notNextCb: (() => void) | null = null,
  slideOtherDirectionCb: (() => void) | null = null,
) {
  if (!checkEvent(e)) return;
  if (!state.isDown) return;
  // console.log('slideTouchMove-state', state.isDown);

  //计算移动距离
  const x = e.pageX - state.start.x;
  const y = e.pageY - state.start.y;
  // state = {
  //   ...state,
  //   move: { x, y },
  // };
  state.move.x = x;
  state.move.y = y;
  //检测能不能滑动
  const canSlideRes = canSlide(state);
  //是否向下或向右滑动
  const isNext = state.type === SlideType.HORIZONTAL ? state.move.x < 0 : state.move.y < 0;
  // console.log('isNext', state.move.x, state.move.y, isNext);
  if (canSlideRes) {
    //如果传了就用，没传就用默认的
    //无限滑动组件，要特别判断，所以需要传canNextCb
    if (!canNextCb) canNextCb = canNext;
    if (canNextCb(state, isNext)) {
      window.isMoved = true;
      //能滑动，那就把事件捕获，不能给父组件处理
      e.stopPropagation();
      //   if (state.type === SlideType.HORIZONTAL) {
      //   }
      const t = getSliceOffset(state, el) + (isNext ? state.judgeValue : -state.judgeValue);
      let dx1 = 0,
        dx2 = 0;
      if (state.type === SlideType.HORIZONTAL) {
        dx1 = t + state.move.x;
      } else {
        dx2 = t + state.move.y;
      }

      el.style.transitionDuration = '0ms';
      el.style.transform = `translate(${dx1}px,${dx2}px)`;
      // console.log('state-move-move', state);
    } else {
      notNextCb?.();
    }
  } else {
    slideOtherDirectionCb?.();
  }
}

/**
 * 处理滑动结束事件
 * @param e React.PointerEvent<HTMLDivElement> - 事件对象
 * @param state SlideState - 滑动状态对象
 * @param canNextCb ((state: SlideState, isNext: boolean) => boolean) | null - 判断是否能继续滑动的回调函数
 * @param nextCb ((isNext: boolean) => void) | null - 滑动成功时的回调函数
 * @param notNextCb (() => void) | null - 滑动失败时的回调函数
 */
export function slideTouchEnd(
  e: React.PointerEvent<HTMLDivElement>,
  state: SlideState,
  canNextCb: ((state: SlideState, isNext: boolean) => boolean) | null = null,
  nextCb: ((isNext: boolean) => void) | null = null,
  notNextCb: (() => void) | null = null,
) {
  if (!checkEvent(e)) return;
  // console.log('slideTouchEnd-state', state.isDown);
  if (!state.isDown) return;
  console.log('slideTouchEnd-state.next', state.next);
  if (state.next) {
    const isHorizontal = state.type === SlideType.HORIZONTAL;
    const isNext = isHorizontal ? state.move.x < 0 : state.move.y < 0;

    //同move事件
    if (!canNextCb) canNextCb = canNext;
    // console.log('end-canNext', canNextCb(state, isNext), isNext);
    if (canNextCb(state, isNext)) {
      //结合时间、距离来判断是否成功滑动
      const endTime = Date.now();
      let gapTime = endTime - state.start.time;
      const distance = isHorizontal ? state.move.x : state.move.y;
      const judgeValue = isHorizontal ? state.wrapper.width : state.wrapper.height;

      //1.距离太短，直接不通过
      // if (Math.abs(distance) < judgeValue * 0.5) gapTime = 1000;
      if (Math.abs(distance) < 20) {
        gapTime = 1000;
        // console.log('flag-1');
      }

      //2.距离太长，直接通过
      if (Math.abs(distance) > judgeValue / 3) {
        gapTime = 100;
        // console.log('flag-2');
      }

      //3.若不在上述两种情况，则根据时间判断，时间越短，滑动越快，通过
      if (gapTime < 150) {
        if (isNext) {
          state.localIndex++;
          // console.log('flag-3');
        } else {
          state.localIndex--;
          // console.log('flag-4');
        }

        return nextCb?.(isNext);
      } else {
        // console.log('flag-5');
        return notNextCb?.();
      }
    } else {
      notNextCb?.();
    }
  }
}

/**
 * 结束后重置变量
 * @param el
 * @param state
 * @param emit
 */
//滑动结束，重置状态
// emit = null
export function slideReset(
  e: React.PointerEvent<HTMLDivElement>,
  el: HTMLDivElement,
  state: SlideState,
  emit: any = null,
) {
  if (!checkEvent(e)) return;
  el.style.transitionDuration = '300ms';
  const t = getSliceOffset(state, el);
  let dx1 = 0,
    dx2 = 0;
  if (state.type === SlideType.HORIZONTAL) {
    // bus.emit(state.name + '-end', state.localIndex)
    dx1 = t;
  } else {
    // bus.emit(state.name + '-end');
    dx2 = t;
  }

  el.style.transform = `translate3d(${dx1}px,${dx2}px,0)`;
  state.start.x = state.start.y = state.start.time = state.move.x = state.move.y = 0;
  state.needCheck = true;
  state.isDown = false;
  state.next = false;
  setTimeout(() => {
    window.isMoved = false;
  }, 200);
  emit?.('update:index', state.localIndex);
}

//根据当前index，获取slide偏移距离
//如果每个页面的宽度是相同均为100%，只需要当前index * wrapper的宽（高）度即可： -state.localIndex * state.wrapper.width
export function getSliceOffset(state: SlideState, el: HTMLDivElement): number {
  // console.log('state', state);

  //横竖逻辑基本相同
  if (state.type === SlideType.HORIZONTAL) {
    let widths: number[] = [];
    Array.from(el.children).map((item) => {
      widths.push(item.getBoundingClientRect().width);
    });

    //取0到当前index的的子元素宽度
    widths = widths.slice(0, state.localIndex);
    if (widths.length) {
      return -widths.reduce((a, b) => a + b, 0);
    }

    return 0;
  } else {
    //VERTICAL_INFINITE列表只需要计算index*wrapper的高度即可
    if (state.type === SlideType.VERTICAL_INFINITE) {
      return -state.localIndex * state.wrapper.height;
    } else {
      let heights: number[] = [];
      Array.from(el.children).map((item) => {
        heights.push(item.getBoundingClientRect().height);
      });
      heights = heights.slice(0, state.localIndex);
      console.log('heights', heights);

      if (heights.length) return -heights.reduce((a, b) => a + b);
      return 0;
    }
  }
}
