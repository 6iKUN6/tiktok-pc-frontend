// import request from '@/services/request';
import { request } from '@/services/request';
import type { Pages } from '@/types';

// export const getRecommendedVideos = (page: Pages) => {
//   return request.get('/video/getRecommendedVideos', { params: page });
// };

export const getRecommendedVideos = (page: Pages) => {
  return request({ url: '/video/getRecommendedVideos', method: 'get', params: page });
};
