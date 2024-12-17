const BASE_URL_MAP = {
  DEV: '',
  PROD: '',
  GP_PAGES: '',
  GITEE_PAGES: '/douyin',
  UNI: '',
};

// 定义 VITE_ENV 的可能值
type Env = 'DEV' | 'PROD' | 'GP_PAGES' | 'GITEE_PAGES' | 'UNI';

// 确保 import.meta.env.VITE_ENV 的类型是 Env
const env: Env = import.meta.env.VITE_ENV as Env;

export const BASE_URL = BASE_URL_MAP[env];
export const IMG_URL = BASE_URL + '/images/';
