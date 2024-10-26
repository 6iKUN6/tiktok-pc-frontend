import { Navigate, RouteObject } from 'react-router-dom';

import Home from '@/page/home';
import NotFound from '@/page/404';

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
];
