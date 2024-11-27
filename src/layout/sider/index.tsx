import { Layout } from 'antd';
import { FC } from 'react';

import Divider from './divider';
import Menu from './menu/menu';
import { baseMenuList, orderMenuList, bottomMenuList } from './menu/menuList';

import { useSiderStore } from '@/store';
import './index.scss';

const { Sider } = Layout;
const { Item } = Menu;

const SiderComp: FC = () => {
  const { currSiderIndex, setSider } = useSiderStore();
  return (
    <Sider className="sider-box">
      <Menu>
        {baseMenuList.map(({ title, icon, activeIcon, id }) => (
          <Item
            title={title}
            icon={icon}
            activeIcon={activeIcon}
            key={id}
            active={id === currSiderIndex}
            onClick={() => setSider(id)}
          />
        ))}
      </Menu>
      <Divider />
      <Menu>
        {orderMenuList.map(({ title, icon, activeIcon, id }) => (
          <Item
            title={title}
            icon={icon}
            activeIcon={activeIcon}
            key={id}
            active={id === currSiderIndex}
            onClick={() => setSider(id)}
          />
        ))}
      </Menu>
      <Menu className="bottom-menu">
        {bottomMenuList.map(({ title, icon, activeIcon, id }) => (
          <Item title={title} icon={icon} activeIcon={activeIcon} key={id} />
        ))}
      </Menu>
    </Sider>
  );
};

export default SiderComp;
