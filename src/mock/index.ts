// import Mock from 'mockjs';
// import fetchMock from 'fetch-mock';
import MockAdapter from 'axios-mock-adapter';

import { axiosInstance } from '@/services/request';
import post6 from '@/assets/data/videos.json';
import type { Pages } from '@/types';
import { HttpStatus } from '@/utils/constant';
import { BASE_URL } from '@/config';
import { useBaseStore } from '@/store';

let allv = post6.map((v: any) => {
  v.type = 'recommend-video';
  return v;
});

export function getPage(params: Pages): { limit: number; offset: number; pageNo: number } {
  const offset = (params.page - 1) * params.pageSize;
  const limit = params.page * params.pageSize + params.pageSize;
  return { limit, offset, pageNo: params.page };
}

async function fetchData() {
  const { users: userList } = useBaseStore.getState();
  // console.log('BASE_URL', BASE_URL + '/data/video.json');
  await fetch(BASE_URL + '/data/videos.json').then((data) => {
    // console.log('fetch-data', data.json);
    data.json().then((videos) => {
      videos = videos.map((video: any) => {
        video.type = 'recommend-video';
        const item: any = userList.find((a) => String(a.uid) === String(video.author_user_id));
        if (item) video.author = item;
        return video;
      });

      allv = allv.concat(videos);
      console.log('userList', userList);
      console.log('allv', allv);
    });
  });
}

const mock = new MockAdapter(axiosInstance);

export async function runMock() {
  mock.onGet('/video/getRecommendedVideos').reply(async (config) => {
    const { limit, offset } = getPage(config.params);

    return [
      HttpStatus.OK,
      {
        data: {
          total: 844,
          list: allv.slice(offset, limit),
        },
        code: HttpStatus.OK,
        msg: 'success',
      },
    ];
  });
  mock.onGet('user/friends').reply(async () => {
    const res = await fetch(BASE_URL + '/data/users.json');
    const u = await res.json();
    return [
      HttpStatus.OK,
      {
        code: HttpStatus.OK,
        data: u,
        msg: 'success',
      },
    ];
  });

  setTimeout(() => {
    fetchData();
  }, 500);
}

// fetch('http://localhost:5173/video/getRecommendedVideos').then((res) => {
//   console.log(res.body);
// });
