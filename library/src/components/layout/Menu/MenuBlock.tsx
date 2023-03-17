import SettingsIcon from '@mui/icons-material/Settings';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'store';
import {
  EntityItem,
  isActionItem,
  isEntityItem,
  RouteMapBlock,
  RouteMapItem,
} from '../../../router/routeMapParser';
import MenuListItem from './MenuListItem';
import { StyledMenuListSubItem } from './MenuListItem.styles';

interface menuBlockProps {
  routeMapBlock: RouteMapItem | RouteMapBlock;
  idx: string | number;
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {
  const { routeMapBlock, idx } = props;

  const openIdx = useStoreState((store) => store.menu.open);
  const open = openIdx === idx;
  const colapseMenu = useStoreActions((actions) => actions.menu.colapse);
  const expandMenu = useStoreActions((actions) => actions.menu.expand);

  const { label, children } = routeMapBlock as RouteMapBlock;
  const selectedChild = (children || []).find((item: RouteMapItem) => {
    if (!isEntityItem(item)) {
      return false;
    }

    const route = item.route;
    const match =
      location.pathname === `${route}` ||
      location.pathname.indexOf(`${route}/`) === 0;

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
      colapseMenu();
    } else {
      expandMenu(idx);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {(children || []).map((item: RouteMapItem, key: number) => {
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
              <StyledMenuListSubItem
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
