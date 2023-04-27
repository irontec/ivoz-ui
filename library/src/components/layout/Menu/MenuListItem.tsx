import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreActions } from 'store';
import { MenuListItemIcon } from './MenuListItemIcon';
import { BaseSyntheticEvent } from 'react';

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

  const currentPath = location.href;
  const baseHref = document.querySelector('base')?.href.slice(0, -1) || '';
  const targetPath = baseHref + path;

  const selected =
    currentPath === targetPath || currentPath.indexOf(`${targetPath}/`) === 0;

  return (
    <ListItemButton
      component='a'
      href={path}
      className={className}
      dense={true}
      selected={selected}
      onClick={(e: BaseSyntheticEvent) => {
        e?.stopPropagation();
        e?.preventDefault();

        hideMenu();
        navigate(path, {
          state: {
            referrer: location.pathname,
          },
        });
      }}
    >
      <ListItemIcon>
        <Tooltip title={text as string} placement='bottom-start'>
          <MenuListItemIcon icon={icon} />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
