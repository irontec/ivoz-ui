import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { PathMatch } from 'react-router-dom';
import { useStoreState } from 'store';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import useRouteChain from '../../../../hooks/useRouteChain';
import { EntityItem, RouteMap } from '../../../../router/routeMapParser';
import _ from '../../../../services/translations/translate';
import {
  StyledCollapsedBreadcrumbsLink,
  StyledCollapsedBreadcrumbsNavigateNextIcon,
  StyledCollapsedBreadcrumbsTypography,
} from './styles/Links.styles';

type BreadcrumbsProps = {
  routeMap: RouteMap;
  desktop: boolean;
};

const getEntityItemLink = (
  routeItem: EntityItem,
  match: PathMatch<string>
): string => {
  const baseUrl = process.env.BASE_URL || '/';

  let to = `${baseUrl}${routeItem.route?.substring(1)}` || '/';
  for (const idx in match.params) {
    const val = match.params[idx] as string;
    to = to.replace(`:${idx}`, val);
  }

  return to;
};

const Breadcrumbs = (props: BreadcrumbsProps): JSX.Element | null => {
  const { routeMap, desktop = true } = props;

  const match = useCurrentPathMatch();
  const formRow = useStoreState((state) => state.form.row);

  const routeItems = useRouteChain({
    routeMap,
    match,
  });

  const lastPathSegment = match.pathname.split('/').pop() as string;
  const showEntityToStr = ['detailed', 'update'].includes(lastPathSegment);

  const lastRouteItem = routeItems[routeItems.length - 1];
  const entity = lastRouteItem ? lastRouteItem.entity : undefined;

  const appendOnEdit =
    showEntityToStr && entity && formRow ? entity.toStr(formRow) : '';

  const appendOnNew = lastPathSegment === 'create' ? _('New') : '';

  const appendSegment = appendOnEdit || appendOnNew;

  if (routeItems.length === 0) {
    return null;
  }

  if (!desktop) {
    let routeItem = routeItems.pop() as EntityItem;
    const title = routeItem.entity.title;

    let baseUrl = process.env.BASE_URL || '';
    if (baseUrl.slice(-1) === '/') {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }
    if (
      baseUrl + routeItem.route === match.pattern.path &&
      routeItems.length > 0
    ) {
      routeItem = routeItems[routeItems.length - 1] as EntityItem;
    }

    const to =
      routeItems.length > 0 ? getEntityItemLink(routeItem, match) : baseUrl;

    return (
      <StyledCollapsedBreadcrumbsLink className='back-mobile' to={to}>
        <NavigateBeforeRoundedIcon /> {appendSegment || title}
      </StyledCollapsedBreadcrumbsLink>
    );
  }

  return (
    <MuiBreadcrumbs
      separator={<StyledCollapsedBreadcrumbsNavigateNextIcon />}
      aria-label='breadcrumb'
    >
      {routeItems.map((routeItem, key: number) => {
        const to = getEntityItemLink(routeItem, match);
        const entity = routeItem.entity;
        const isLast = key + 1 === routeItems.length;

        return (
          <span key={key} style={{ display: 'flex', gap: '12px' }}>
            <StyledCollapsedBreadcrumbsLink to={to}>
              {entity.title}
            </StyledCollapsedBreadcrumbsLink>
            {isLast && entity.link && !appendSegment && (
              <a
                target='_blank'
                href={entity.link}
                rel='noreferrer'
                style={{ height: '24px' }}
              >
                <img src='assets/img/breadcrumb-link.svg' />
              </a>
            )}
          </span>
        );
      })}
      {appendSegment && (
        <StyledCollapsedBreadcrumbsTypography>
          {appendSegment}
        </StyledCollapsedBreadcrumbsTypography>
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
