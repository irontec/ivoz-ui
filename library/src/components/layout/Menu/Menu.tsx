import { useStoreState } from 'store';
import {
  EntityItem,
  RouteMap,
  RouteMapItem,
  isEntityItem,
} from '../../../router/routeMapParser';
import { StyledDivider, StyledHomeIcon, StyledMenuList } from './Menu.styles';
import MenuBlock from './MenuBlock';
import MenuHeader from './MenuHeader';
import MenuListItem from './MenuListItem';
interface menuProps {
  routeMap: RouteMap;
}

export default function Menu(props: menuProps): JSX.Element | null {
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
          <>
            <StyledDivider />
            <div key={key}>
              <MenuBlock idx={key} routeMapBlock={routeMapBlock} />
            </div>
          </>
        );
      })}
    </StyledMenuList>
  );
}
