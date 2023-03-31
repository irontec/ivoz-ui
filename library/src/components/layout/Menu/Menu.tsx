import { useMediaQuery, useTheme } from '@mui/material';
import {
  EntityItem,
  RouteMap,
  RouteMapItem,
  isEntityItem,
} from '../../../router/routeMapParser';
import { StyledDivider, StyledHomeIcon, StyledMenuList } from './Menu.styles';
import MenuBlock from './MenuBlock';
import { StyledMenuHeader } from './MenuHeader.styles';
import MenuListItem from './MenuListItem';
import { useStoreState } from 'store';

interface menuProps {
  routeMap: RouteMap;
}

export default function Menu(props: menuProps): JSX.Element | null {
  const { routeMap } = props;

  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));
  const menuVariant = useStoreState((state) => state.menu.variant);

  if (!bigScreen) {
    return null;
  }

  return (
    <StyledMenuList className={menuVariant}>
      <StyledMenuHeader />
      <MenuListItem path='/' icon={<StyledHomeIcon />} text={'Dashboard'} />
      <StyledDivider />
      {routeMap.map((routeMapBlock, key: number) => {
        if (isEntityItem(routeMapBlock as RouteMapItem)) {
          const entity = (routeMapBlock as EntityItem).entity;

          return (
            <MenuListItem
              key={key}
              path={entity.localPath || entity.path}
              icon={<entity.icon />}
              text={entity.title}
            />
          );
        }

        return (
          <div key={key}>
            <StyledDivider />
            <MenuBlock idx={key} routeMapBlock={routeMapBlock} />
          </div>
        );
      })}
    </StyledMenuList>
  );
}
