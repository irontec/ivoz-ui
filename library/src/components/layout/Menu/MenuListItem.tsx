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

  const href = `${process.env.BASE_URL}${path}`.replace('//', '/');

  return (
    <ListItemButton
      component='a'
      href={href}
      className={className}
      dense={true}
      selected={selected}
      onClick={(e: BaseSyntheticEvent) => {
        e?.stopPropagation();
        e?.preventDefault();

        hideMenu();
        navigate(href, {
          state: {
            referrer: location.pathname,
          },
        });
      }}
    >
      <ListItemIcon>
        <Tooltip title={text as string} placement='left-end'>
          <MenuListItemIcon icon={icon} />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
