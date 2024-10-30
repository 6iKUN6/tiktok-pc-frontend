import { FC } from 'react';
import './index.less';

interface MenuProps {
  children?: React.ReactNode;
}

const Menu: { Item: FC<MenuItemProps> } & FC<MenuProps> = ({ children }) => {
  return <div className="menu">{children}</div>;
};

interface MenuItemProps {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ title, icon, active, onClick }) => {
  return (
    <div className={`menu-item ${active && 'is-active'}`} onClick={onClick}>
      <span>{title}</span>
      <span>{icon}</span>
    </div>
  );
};

Menu.Item = MenuItem;

export default Menu;
