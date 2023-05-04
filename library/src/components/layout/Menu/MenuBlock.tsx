import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { GearIcon } from '../../../icons/GearIcon';
import { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'store';
import {
  EntityItem,
  RouteMapBlock,
  RouteMapItem,
  isActionItem,
  isEntityItem,
} from '../../../router/routeMapParser';
import MenuListItem from './MenuListItem';

interface menuBlockProps {
  routeMapBlock: RouteMapItem | RouteMapBlock;
  idx: string | number;
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {
  const { routeMapBlock, idx } = props;

  const selectedIdx = useStoreState((store) => store.menu.selected);
  const open = selectedIdx === idx;
  const collapseMenu = useStoreActions((actions) => actions.menu.collapse);
  const expandMenu = useStoreActions((actions) => actions.menu.expand);

  const { label, children, icon: CustomIcon } = routeMapBlock as RouteMapBlock;
  const selectedChild = (children || []).find((item: RouteMapItem) => {
    if (!isEntityItem(item)) {
      return false;
    }

    const route = item.route;
    const currentPath = location.href;
    const baseHref = document.querySelector('base')?.href.slice(0, -1) || '';
    const targetPath = baseHref + route;

    const match =
      currentPath === targetPath || currentPath.indexOf(`${targetPath}/`) === 0;

    return match;
  });

  useEffect(() => {
    if (selectedChild) {
      expandMenu(idx);
    }
  }, []);

  if (isEntityItem(routeMapBlock as RouteMapItem)) {
    const entity = (routeMapBlock as EntityItem).entity;
    return (
      <MenuListItem
        path={entity.path}
        icon={<entity.icon />}
        text={entity.title}
      />
    );
  }

  const handleClick = () => {
    if (open) {
      collapseMenu();
    } else {
      expandMenu(idx);
    }
  };

  let selected = false;
  for (const item of children) {
    if (isActionItem(item)) {
      continue;
    }

    const path = item.route;

    selected =
      location.pathname === path || location.pathname.indexOf(`${path}/`) === 0;

    if (selected) {
      break;
    }
  }

  return (
    <>
      <ListItemButton selected={selected} onClick={handleClick}>
        <ListItemIcon>
          {CustomIcon ? <CustomIcon /> : <GearIcon />}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {children.map((item: RouteMapItem, key: number) => {
            if (isActionItem(item)) {
              return null;
            }

            const { route, entity } = item;

            if (!entity) {
              return null;
            }

            if (!route) {
              return null;
            }

            return (
              <MenuListItem
                key={key}
                path={route}
                icon={<entity.icon />}
                text={entity.title}
              />
            );
          })}
        </List>
      </Collapse>
    </>
  );
}
