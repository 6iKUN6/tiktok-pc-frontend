import { Layout } from 'antd';
import { FC } from 'react';

import './index.less';

const { Content } = Layout;
const ContentComp: FC = () => {
  return (
    <Content className="content-box">
      <div className="body">ContentComp</div>
    </Content>
  );
};

export default ContentComp;
