import { create } from 'zustand';

interface VideoState {
  list: [];
  prevIndex: number;
  currIndex: number;
  isMuted: boolean;
  isPlay: boolean;
  isLive: boolean;
  isMy: boolean;
  isShowComment: boolean;
}
interface VideoActions {
  loadMore: () => void;
}

type VideoStore = VideoActions & VideoState;

const useVideoStore = create<VideoStore>((set) => ({
  list: [],
  prevIndex: 0,
  currIndex: -1,
  isMuted: false,
  isPlay: false,
  isLive: false,
  isMy: false,
  isShowComment: false,
  loadMore: () => {
    set((state) => ({
      list: [...state.list, ...state.list],
    }));
  },
}));

export default useVideoStore;
