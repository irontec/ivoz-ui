import SettingsIcon from '@mui/icons-material/Settings';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
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
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {
  const { routeMapBlock } = props;

  const [open, setOpen] = useState(false);

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

  const { label, children } = routeMapBlock as RouteMapBlock;
  const handleClick = () => {
    setOpen(!open);
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
