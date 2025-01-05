import { Navigate, RouteObject } from 'react-router-dom';

import Home from '@/page/home';
import NotFound from '@/page/404';
import Music from '@/page/music';
import Live from '@/page/live';

export const routerMap: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    children: [],
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home/music',
        element: <Music />,
      },
      {
        path: '/home/live',
        element: <Live />,
      },
    ],
  },
];
