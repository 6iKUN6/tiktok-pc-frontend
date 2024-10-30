import { Layout } from 'antd';
import { FC } from 'react';

import Menu from './menu/menu';
import { menuList } from './menu/menuList';

import { useSiderStore } from '@/store';

const { Sider } = Layout;
const { Item } = Menu;

const SiderComp: FC = () => {
  const { currSiderIndex, setSider } = useSiderStore();
  return (
    <Sider>
      <Menu>
        {menuList.map(({ title, icon }, index) => (
          <Item
            title={title}
            icon={icon}
            key={index}
            active={index === currSiderIndex}
            onClick={() => setSider(index)}
          />
        ))}
      </Menu>
    </Sider>
  );
};

export default SiderComp;
