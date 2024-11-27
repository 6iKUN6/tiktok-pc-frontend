import { FC } from 'react';
import { Input, Space, Button, ConfigProvider } from 'antd';

import theme from './theme';
import './index.scss';

const SearchInp: FC = () => {
  return (
    <div className="input-box">
      <ConfigProvider theme={theme}>
        <Space.Compact>
          <Input placeholder="placeholder" className="input-element" />
          <Button className="search-btn">搜索</Button>
        </Space.Compact>
      </ConfigProvider>
    </div>
  );
};

export default SearchInp;
