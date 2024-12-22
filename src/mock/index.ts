// import Mock from 'mockjs';
// import fetchMock from 'fetch-mock';
import MockAdapter from 'axios-mock-adapter';

import { axiosInstance } from '@/services/request';
import allRecommendVideos from '@/assets/data/videos.json';
import type { Pages } from '@/types';
import { HttpStatus } from '@/utils/constant';

export function getPage(params: Pages): { limit: number; offset: number; pageNo: number } {
  const offset = (params.page - 1) * params.pageSize;
  const limit = params.page * params.pageSize + params.pageSize;
  return { limit, offset, pageNo: params.page };
}

const mock = new MockAdapter(axiosInstance);

export async function runMock() {
  // console.log('runMock?');
  mock.onGet('/video/getRecommendedVideos').reply(async (config) => {
    const { limit, offset } = getPage(config.params);
    // console.log(config.params);
    // console.log(limit, offset);
    // console.log('allRecommendVideos', allRecommendVideos);

    return [
      HttpStatus.OK,
      {
        data: {
          total: 844,
          list: allRecommendVideos.slice(offset, limit),
        },
        code: HttpStatus.OK,
        msg: 'success',
      },
    ];
  });
}

// fetch('http://localhost:5173/video/getRecommendedVideos').then((res) => {
//   console.log(res.body);
// });
