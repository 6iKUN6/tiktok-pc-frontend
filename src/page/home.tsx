import { FC } from 'react';
import { Layout } from 'antd';

import ContentComp from '@/layout/content';
import HeaderComp from '@/layout/header';
import SiderComp from '@/layout/sider';

const HomePage: FC = () => {
  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <HeaderComp />
      <Layout>
        <SiderComp />
        <ContentComp />
      </Layout>
    </Layout>
  );
};

export default HomePage;
