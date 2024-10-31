import { ReactNode } from 'react';
import { PiChatDotsLight } from 'react-icons/pi';
import { RiVideoAddLine } from 'react-icons/ri';

export interface IHeaderMenu {
  key: string;
  icon: ReactNode;
  title: string;
}

export const menuList: IHeaderMenu[] = [
  {
    key: '1',
    icon: <PiChatDotsLight />,
    title: '消息',
  },
  {
    key: '2',
    icon: <RiVideoAddLine />,
    title: '投稿',
  },
];
