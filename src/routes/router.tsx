import { ReactElement, useEffect } from 'react';
import { message } from 'antd';

import storage from '@/utils/storage';
// import { useNavigate } from 'react-router-dom';

interface IRoute {
  children: ReactElement;
}

//路由守卫
const PrivateRoute = ({ children }: IRoute) => {
  //   const navigator = useNavigate();
  function isPast48Hours(timestamp: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - timestamp;
    const hours48InSeconds = 48 * 60 * 60;
    return timeDifference > hours48InSeconds;
  }

  useEffect(() => {
    try {
      const token: any = storage.getItem('token');
      const tokenObj = JSON.parse(token);
      if (tokenObj === null || isPast48Hours(tokenObj.expired)) {
        message.warning('token过期,请重新登录'); //打开登录窗
      }
    } catch (error: any) {
      message.warning('token过期,请重新登录', error);
    }
  }, []);
  return <>{children}</>;
};

export default PrivateRoute;
