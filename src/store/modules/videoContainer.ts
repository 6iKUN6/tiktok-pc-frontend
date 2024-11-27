import { create } from 'zustand';

interface VideoContainerState {
  itemHeight: number;
  setItemHeight: (height: number) => void;
}

export const useVideoContainerStore = create<VideoContainerState>((set) => ({
  itemHeight: 0,
  setItemHeight: (height) => set({ itemHeight: height }),
}));
