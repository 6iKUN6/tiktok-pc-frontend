import {
  RiHome2Line,
  RiHome2Fill,
  RiUserFollowLine,
  RiUserFollowFill,
  RiLiveFill,
  RiLiveLine,
  RiMovie2Line,
  RiMovie2Fill,
  RiBookOpenLine,
  RiBookOpenFill,
} from 'react-icons/ri';
import {
  PiStarFourBold,
  PiStarFourFill,
  PiVideoFill,
  PiVideoLight,
  PiGameControllerFill,
  PiGameControllerLight,
  PiGhostFill,
  PiGhost,
  PiMusicNotesFill,
  PiMusicNotes,
  PiBowlFoodFill,
  PiBowlFood,
} from 'react-icons/pi';
import { HiOutlineUsers, HiUsers, HiUser, HiOutlineUser } from 'react-icons/hi2';
import { IoSettingsSharp, IoSettingsOutline, IoApps, IoAppsOutline } from 'react-icons/io5';

export interface IMenuItem {
  id: number;
  title: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export const baseMenuList: IMenuItem[] = [
  {
    id: 0,
    title: '首页',
    icon: <RiHome2Line />,
    activeIcon: <RiHome2Fill />,
  },
  {
    id: 1,
    title: '推荐',
    icon: <PiStarFourBold />,
    activeIcon: <PiStarFourFill />,
  },
  {
    id: 2,
    title: '关注',
    icon: <RiUserFollowLine />,
    activeIcon: <RiUserFollowFill />,
  },
  {
    id: 3,
    title: '朋友',
    icon: <HiOutlineUsers />,
    activeIcon: <HiUsers />,
  },
  {
    id: 4,
    title: '我的',
    icon: <HiOutlineUser />,
    activeIcon: <HiUser />,
  },
];

//拓展菜单
export const orderMenuList: IMenuItem[] = [
  {
    id: 5,
    title: '直播',
    icon: <RiLiveLine />,
    activeIcon: <RiLiveFill />,
  },
  {
    id: 6,
    title: '放映厅',
    icon: <RiMovie2Line />,
    activeIcon: <RiMovie2Fill />,
  },
  {
    id: 7,
    title: '短剧',
    icon: <PiVideoLight />,
    activeIcon: <PiVideoFill />,
  },
  {
    id: 8,
    title: '知识',
    icon: <RiBookOpenLine />,
    activeIcon: <RiBookOpenFill />,
  },
  {
    id: 9,
    title: '游戏',
    icon: <PiGameControllerLight />,
    activeIcon: <PiGameControllerFill />,
  },
  {
    id: 10,
    title: '二次元',
    icon: <PiGhost />,
    activeIcon: <PiGhostFill />,
  },
  {
    id: 11,
    title: '音乐',
    icon: <PiMusicNotes />,
    activeIcon: <PiMusicNotesFill />,
  },
  {
    id: 12,
    title: '美食',
    icon: <PiBowlFood />,
    activeIcon: <PiBowlFoodFill />,
  },
];

export const bottomMenuList: IMenuItem[] = [
  {
    id: 13,
    title: '设置',
    icon: <IoSettingsOutline />,
    activeIcon: <IoSettingsSharp />,
  },
  {
    id: 14,
    title: '业务合作',
    icon: <IoAppsOutline />,
    activeIcon: <IoApps />,
  },
];
