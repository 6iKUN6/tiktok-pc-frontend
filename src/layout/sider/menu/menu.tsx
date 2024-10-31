import { FC, HTMLAttributes } from 'react';
import './index.less';

import type { IMenuItem } from './menuList';

interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Menu: { Item: FC<MenuItemProps> } & FC<MenuProps> = ({ children, className = '' }) => {
  return <div className={`menu ${className}`}>{children}</div>;
};

interface MenuItemProps extends Partial<IMenuItem> {
  active?: boolean;
  onClick?: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ title, icon, activeIcon, active, onClick }) => {
  return (
    <div className={`menu-item ${active && 'is-active'}`} onClick={onClick}>
      <span className="icon-node">{active ? activeIcon : icon}</span>
      <span>{title}</span>
    </div>
  );
};

Menu.Item = MenuItem;

export default Menu;
