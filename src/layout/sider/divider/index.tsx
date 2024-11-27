import { FC } from 'react';

import './index.scss';

interface DividerProps {
  text?: string;
  type?: 'line' | 'text';
  variant?: 'dashed' | 'solid' | 'dotted';
}

const Divider: FC<DividerProps> = ({ text, type, variant }) => {
  const className = `divider-box ${type ? `divider-type-${type}` : ''} ${variant ? `divider-variant-${variant}` : ''}`;

  return <div className={className}>{text && <span className="divider-text">{text}</span>}</div>;
};

export default Divider;
