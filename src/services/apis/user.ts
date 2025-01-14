import { request } from '../request';

export const getFriends = (params?: any, data?: any) => {
  return request({ url: '/user/friends', method: 'get', params, data });
};
