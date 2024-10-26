import { create } from 'zustand';

interface TestAction {
  add: () => void;
  subtract: () => void;
  getCount: () => number;
}

interface TestState {
  count: number;
}

type TestStore = TestState & TestAction;

export const useTestStore = create<TestStore>((set, get) => ({
  count: 0,
  getCount: () => get().count,
  add: () => set((state) => ({ count: state.count + 1 })),
  subtract: () => set((state) => ({ count: state.count - 1 })),
}));
