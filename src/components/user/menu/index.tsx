import { FC } from 'react';

import { IHeaderMenu } from './menuList';

import './index.scss';

interface IMenuProps {
  children?: React.ReactNode;
}

interface IMenuItemProps extends Partial<IHeaderMenu> {
  active?: boolean;
}

const HeaderMenu: { Item: FC<IMenuItemProps> } & FC<IMenuProps> = ({ children }) => {
  return <div className="header-menu-box">{children}</div>;
};

const Item: FC<IMenuItemProps> = ({ icon, title }) => {
  return (
    <div className="header-menu-item">
      <div>{icon}</div>
      <div>{title}</div>
    </div>
  );
};

HeaderMenu.Item = Item;

export default HeaderMenu;
