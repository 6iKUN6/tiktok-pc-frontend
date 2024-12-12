import { FC } from 'react';
import './index.scss';

//没用上，其实就是个接受children的容器，傻狗react不能直接像vue那样render创建真实dom然后挂载或者appendChild，只能通过useRef然后写原生的
const SlideItem: FC<any> = ({ children, backgroundColor, dataIndex }) => {
  return (
    <div className="slide-item" style={{ backgroundColor: backgroundColor }} data-index={dataIndex}>
      {children}
    </div>
  );
};

export default SlideItem;
