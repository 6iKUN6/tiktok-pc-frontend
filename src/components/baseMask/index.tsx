import { FC } from 'react';

import { cn } from '@/utils/cn';

interface BaseMaskProps {
  mode: 'dark' | 'light';
}

const darkStyle = 'bg-[--mask-dark]';
const lightStyle = 'bg-[--mask-light]';

const BaseMask: FC<BaseMaskProps> = ({ mode }) => {
  const baseMaskClass = 'z-[3] flexed top-0 left-0 w-full h-full';
  const maskClass = mode === 'dark' ? darkStyle : lightStyle;

  return <div className={cn(baseMaskClass, maskClass)}></div>;
};

export default BaseMask;
