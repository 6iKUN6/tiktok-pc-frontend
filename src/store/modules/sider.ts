import { create } from 'zustand';

interface SiderState {
  currSiderIndex: number;
}
interface SiderActions {
  setSider: (sider: number) => void;
}

export const useSiderStore = create<SiderState & SiderActions>((set) => ({
  currSiderIndex: 0, //首页0？
  setSider: (sider) => set({ currSiderIndex: sider }),
}));
