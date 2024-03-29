import { useStoreState } from 'store';
import { Fragment } from 'react';
import {
  EntityItem,
  RouteMap,
  RouteMapItem,
  isActionItem,
  isEntityItem,
} from '../../../router/routeMapParser';
import {
  StyledDivider,
  StyledHomeIcon,
  StyledMenuList,
} from './MenuContent.styles';
import MenuBlock from './MenuBlock';
import MenuHeader from './MenuHeader';
import MenuListItem from './MenuListItem';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Logo from './Logo';

export interface MenuContentProps {
  routeMap: RouteMap;
}

export default function MenuContent(
  props: MenuContentProps
): JSX.Element | null {
  const { routeMap } = props;

  let menuVariant = useStoreState((state) => state.menu.variant);

  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));

  if (!desktop) {
    menuVariant = 'expanded';
  }

  return (
    <StyledMenuList className={`sidemenu ${menuVariant}`}>
      <MenuHeader />
      <Box className='link-container'>
        <MenuListItem path='/' icon={<StyledHomeIcon />} text={'Dashboard'} />
        {routeMap.map((routeMapBlock, key: number) => {
          if (isActionItem(routeMapBlock as RouteMapItem)) {
            return null;
          }

          if (isEntityItem(routeMapBlock as RouteMapItem)) {
            const entity = (routeMapBlock as EntityItem).entity;
            const divider = (routeMapBlock as EntityItem).divider;

            return (
              <Fragment key={key}>
                {divider && <StyledDivider />}
                <MenuListItem
                  key={key}
                  path={entity.localPath || entity.path}
                  icon={<entity.icon />}
                  text={entity.title}
                />
              </Fragment>
            );
          }

          return (
            <Fragment key={key}>
              <StyledDivider />
              <div>
                <MenuBlock idx={key} routeMapBlock={routeMapBlock} />
              </div>
            </Fragment>
          );
        })}
      </Box>
      <Box className='logo'>
        <Logo />
      </Box>
    </StyledMenuList>
  );
}
