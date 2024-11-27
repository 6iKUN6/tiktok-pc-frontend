import { FC } from 'react';
import { Button } from 'antd';
import { PiUserCircleDuotone } from 'react-icons/pi';

import HeaderMenu from './menu';
import { menuList } from './menu/menuList';

import './index.scss';

const User: FC = () => {
  return (
    <div className="user-box">
      <HeaderMenu>
        {menuList.map(({ key, title, icon }) => (
          <HeaderMenu.Item icon={icon} title={title} key={key} />
        ))}
      </HeaderMenu>
      <Button danger type="primary" className="login-btn">
        <PiUserCircleDuotone style={{ fontSize: '18px' }} />
        <span>登录</span>
      </Button>
    </div>
  );
};

export default User;
