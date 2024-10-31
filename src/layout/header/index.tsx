import { Layout } from 'antd';
import { FC } from 'react';

import Logo from '@/components/logo';
import SearchInp from '@/components/searchInput';
import User from '@/components/user';

import './index.less';

const { Header } = Layout;
const HeaderComp: FC = () => {
  return (
    <Header className="header-box">
      <Logo />
      <SearchInp />
      <User />
    </Header>
  );
};

export default HeaderComp;
