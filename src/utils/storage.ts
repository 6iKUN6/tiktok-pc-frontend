interface MutationTypes {
  Authorization: string;
  [key: string]: unknown;
}
const KEY = '_kun_storage';

class Storage {
  constructor() {}
  setItem<T extends keyof MutationTypes>(
    key: T,
    value: MutationTypes[T],
    expired: number = 60 * 60 * 24 * 7,
  ) {
    try {
      const time = Date.now() + expired * 1000;
      localStorage.setItem(
        KEY + key,
        JSON.stringify({
          key,
          value,
          expired: time,
        }),
      );
    } catch (err) {
      console.warn('Storage-Error:setItem', err);
    }
  }
  getItem<T extends keyof MutationTypes>(key: T): MutationTypes[T] | null {
    try {
      const item = localStorage.getItem(KEY + key);
      if (item) {
        const data = JSON.parse(item);
        const isExpired = Date.now() - data.expired > 0;
        if (isExpired) {
          return null;
        }

        return data.value;
      }
    } catch (err) {
      console.warn('Storage-Error:getItem', err);
      return null;
    }
  }
  removeItem<T extends keyof MutationTypes>(key: T) {
    localStorage.removeItem(KEY + key);
    return null;
  }
}

export default new Storage();
