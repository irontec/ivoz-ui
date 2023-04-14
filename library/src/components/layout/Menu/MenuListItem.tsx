import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreActions } from 'store';
import { MenuListItemIcon } from './MenuListItemIcon';

type MenuListItemProps = {
  path: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  className?: string;
};

export default function MenuListItem(
  props: MenuListItemProps
): JSX.Element | null {
  const { path, icon, text, className } = props;
  const navigate = useNavigate();
  const hideMenu = useStoreActions((actions) => actions.menu.hide);

  const selected =
    location.pathname === path || location.pathname.indexOf(`${path}/`) === 0;

  return (
    <ListItemButton
      component='a'
      href={path}
      className={className}
      dense={true}
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        hideMenu();
        navigate(path, {
          state: {
            referrer: location.pathname,
          },
        });
      }}
    >
      <ListItemIcon>
        <Tooltip
          title={text as string}
          placement='bottom-start'
        >
          <MenuListItemIcon icon={icon} />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
