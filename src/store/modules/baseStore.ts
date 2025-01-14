import { create } from 'zustand';

import { getFriends } from '@/services/apis/user';

interface BaseStore {
  users: any[];
}

interface BaseActions {
  //   setUsers: (users: []) => void;
  init: () => void;
}

export const useBaseStore = create<BaseStore & BaseActions>((set) => ({
  users: [],
  //   setUsers: (users: []) => set({ users }),
  init: async () => {
    await getFriends().then((res) => {
      set({ users: res.data });
    });
  },
}));
