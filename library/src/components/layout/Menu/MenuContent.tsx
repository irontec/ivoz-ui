import { useStoreState } from 'store';
import { Fragment } from 'react';
import {
  EntityItem,
  RouteMap,
  RouteMapItem,
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

export interface MenuContentProps {
  routeMap: RouteMap;
}

export default function MenuContent(
  props: MenuContentProps
): JSX.Element | null {
  const { routeMap } = props;

  const menuVariant = useStoreState((state) => state.menu.variant);

  return (
    <StyledMenuList className={`sidemenu ${menuVariant}`}>
      <MenuHeader />
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
          <Fragment key={key}>
            <StyledDivider />
            <div>
              <MenuBlock idx={key} routeMapBlock={routeMapBlock} />
            </div>
          </Fragment>
        );
      })}
    </StyledMenuList>
  );
}
