import { create } from 'zustand';

interface VideoState {
  list: [];
  pageIndex: number;
  pageSize: number;
  total: number;
  currentSize: number;

  prevIndex: number;
  currIndex: number;
  isMuted: boolean;
  isPlay: boolean;
  isLive: boolean;
  isMy: boolean;
  isShowComment: boolean;
}
interface VideoActions {
  setPage: (pageSize: number, pageIndex: number, total: number, currentSize: number) => void;
  getPage: () => {
    pageIndex: number;
    pageSize: number;
    total: number;
    currentSize: number;
  };
  setList: (list: []) => void;
  // loadMore: () => void;
  updatedIndex: (index: number) => void;
  reSetIndex: () => void;
  getCurrentIndexSync: () => number;
  getPrevIndexSync: () => number;
  setMuted: (isMuted: boolean) => void;
}

type VideoStore = VideoActions & VideoState;

export const useVideoStore = create<VideoStore>((set, get) => ({
  list: [],
  pageIndex: 0,
  pageSize: 10,
  total: 0,
  currentSize: 0,

  prevIndex: -1,
  currIndex: 0,
  isMuted: window.isMuted,
  isPlay: false,
  isLive: false,
  isMy: false,
  isShowComment: false,

  setPage: (pageSize, pageIndex, total, currentSize) => {
    set(() => ({
      pageSize,
      pageIndex,
      total,
      currentSize,
    }));
  },
  getPage: () => {
    const { pageIndex, pageSize, total, currentSize } = get();
    return {
      pageIndex,
      pageSize,
      total,
      currentSize,
    };
  },
  setList: (list) => {
    set((prevList) => ({
      list: [...prevList.list, ...list],
      currentSize: prevList.currentSize + list.length,
    }));
  },
  setMuted(isMuted) {
    set(() => ({
      isMuted,
    }));
  },
  reSetIndex() {
    set(() => ({
      prevIndex: -1,
      currIndex: 0,
    }));
  },
  updatedIndex(index) {
    set((state) => ({
      prevIndex: state.currIndex,
      currIndex: index,
    }));
  },
  getCurrentIndexSync() {
    return get().currIndex;
  },
  getPrevIndexSync() {
    return get().prevIndex;
  },
}));
