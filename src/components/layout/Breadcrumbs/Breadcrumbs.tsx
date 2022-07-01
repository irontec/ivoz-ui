import { CircularProgress, styled, Tooltip } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { filterRouteMapPath } from '../../../router/findRoute';
import { EntityItem, isActionItem, RouteMap } from '../../../router/routeMapParser';
import _ from '../../../services/translations/translate';
import { useStoreState } from '../../../store';
import {
  StyledCollapsedBreadcrumbsLink, StyledCollapsedBreadcrumbsNavigateNextIcon,
  StyledCollapsedBreadcrumbsTypography,
  StyledHomeIcon
} from './Breadcrumbs.styles';

type RouterProps = RouteComponentProps<any>;
type BreadcrumbsProps = RouterProps & {
  routeMap: RouteMap,
};

const Breadcrumbs = (props: BreadcrumbsProps): JSX.Element => {

  const { match, routeMap } = props;
  const filteredRouteMapPath = filterRouteMapPath(routeMap, match);

  const routeItems: Array<EntityItem> = filteredRouteMapPath?.entity
    ? [{entity: filteredRouteMapPath.entity, route: filteredRouteMapPath.route}]
    : [];

  let child = filteredRouteMapPath?.children?.[0];

  while(child) {

    if (isActionItem(child)) {
      break;
    }

    routeItems.push({entity: child.entity, route: child.route});
    child = child.children?.[0];
  }

  const lastPathSegment = (match.path as string).split('/').pop() as string;
  const appendSegment =
    ['create', 'detailed', 'update'].includes(lastPathSegment);

  const translatedLastPathSegment = appendSegment
    ? _(lastPathSegment[0].toUpperCase() + lastPathSegment.substring(1))
    : false;

  const loading = useStoreState((state: any) => state.api.loading);
  const StyleCircularProgress = styled(CircularProgress)(() => {
    return {
      margin:'0 4px'
    }
  });

  const homeIcon = loading
    ? (<StyleCircularProgress size="20px" color="inherit" />)
    : (<StyledHomeIcon />);

  return (
    <MuiBreadcrumbs
      separator={<StyledCollapsedBreadcrumbsNavigateNextIcon />}
      aria-label="breadcrumb"
    >
      <StyledCollapsedBreadcrumbsLink to={'/'}>
        <Tooltip title={_('Dashboard')} enterTouchDelay={0}>
          {homeIcon}
        </Tooltip>
      </StyledCollapsedBreadcrumbsLink>
      {routeItems.map((routeItem, key: number) => {

        let to = routeItem.route || '/';
        for (const idx in match.params) {
          const val: string = match.params[idx];
          to = to.replace(`:${idx}`, val);
        }

        if (key+1 === routeItems.length) {
          return (
            <StyledCollapsedBreadcrumbsLink to={to} key={key}>
              {routeItem.entity.title}
            </StyledCollapsedBreadcrumbsLink>
          );
        }

        return (
          <StyledCollapsedBreadcrumbsLink to={to} key={key}>
            <Tooltip title={routeItem.entity.title} enterTouchDelay={0}>
              <routeItem.entity.icon />
            </Tooltip>
          </StyledCollapsedBreadcrumbsLink>
        );
      })}
      {translatedLastPathSegment && (
        <StyledCollapsedBreadcrumbsTypography>
            {translatedLastPathSegment}
        </StyledCollapsedBreadcrumbsTypography>
      )}

    </MuiBreadcrumbs>
  );
}

export default withRouter(Breadcrumbs);