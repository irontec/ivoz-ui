/* eslint-disable no-script-url */

import { useState, useEffect, createRef } from 'react';
import { useStoreActions, useStoreState } from '../../store';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EntityService from '../../services/entity/EntityService';
import { CriteriaFilterValues } from './Filter/ContentFilter';
import { criteriaToArray, queryStringToCriteria } from './List.helpers';
import ListContent from './Content/ListContent';
import Pagination from './Pagination';
import useQueryStringParams from './useQueryStringParams';
import useCancelToken from '../../hooks/useCancelToken';
import { RouteMap } from '../../router/routeMapParser';
import { foreignKeyResolverType } from '../../entities/EntityInterface';
import findRoute, { findParentEntity } from '../../router/findRoute';
import ErrorMessage from '../shared/ErrorMessage';
import useCurrentPathMatch from '../../hooks/useCurrentPathMatch';
import ErrorBoundary from '../../components/ErrorBoundary';

type ListProps = {
  path: string;
  routeMap: RouteMap;
  entityService: EntityService;
  foreignKeyResolver: foreignKeyResolverType;
};

const List = function (props: ListProps) {
  const { path, foreignKeyResolver, entityService, routeMap } = props;
  const listRef = createRef();

  const location = useLocation();
  const match = useCurrentPathMatch();
  const params = useParams();
  const navigate = useNavigate();

  const currentRoute = findRoute(routeMap, match);
  const parentEntity = findParentEntity(routeMap, match);

  const resetList = useStoreActions((actions: any) => {
    return actions.list.reset;
  });

  const setRows = useStoreActions((actions: any) => {
    return actions.list.setRows;
  });

  const setHeaders = useStoreActions((actions: any) => {
    return actions.list.setHeaders;
  });

  const reqError = useStoreState((store) => store.api.errorMsg);
  const apiGet = useStoreActions((actions: any) => {
    return actions.api.get;
  });
  const defaultItemsPerPage = useStoreState(
    (state) => state.route.defaultItemsPerPage
  );
  const [mounted, cancelToken] = useCancelToken();

  const [criteriaIsReady, setCriteriaIsReady] = useState<boolean>(false);
  const queryStringCriteria: CriteriaFilterValues = useStoreState(
    (state) => state.route.queryStringCriteria
  );
  const setQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.setQueryStringCriteria;
  });

  const [prevPath, setPrevPath] = useState<string>('');
  useEffect(() => {
    resetList();
    setPrevPath(path);
  }, [path]);

  ////////////////////////////
  // Filters
  ////////////////////////////
  const currentQueryParams = useQueryStringParams();
  const filterBy: Array<string> = [];

  if (currentRoute?.filterBy) {
    filterBy.push(currentRoute.filterBy);
    filterBy.push(Object.values(params).pop() as string);
  }

  const filterValues: Array<string> = [];
  const entityFilterValues = currentRoute?.filterValues || {};
  for (const idx in entityFilterValues) {
    const value = entityFilterValues[idx];
    const param =
      value !== null ? `${idx}=${entityFilterValues[idx]}` : `${idx}`;

    filterValues.push(param);
  }

  const filterByStr = filterBy.join('[]=');
  const reqQuerystring = currentQueryParams.join('&');
  const [prevReqQuerystring, setPrevReqQuerystring] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Path change listener
    if (reqQuerystring === prevReqQuerystring) {
      return;
    }

    setPrevReqQuerystring(reqQuerystring);
    const criteria = queryStringToCriteria();
    setQueryStringCriteria(criteria);
    setCriteriaIsReady(true);
  }, [
    reqQuerystring,
    prevReqQuerystring,
    setPrevReqQuerystring,
    setQueryStringCriteria,
    setCriteriaIsReady,
  ]);

  useEffect(() => {
    // Criteria change listener
    if (reqQuerystring !== prevReqQuerystring) {
      return;
    }
    const newReqQuerystring = criteriaToArray(queryStringCriteria).join('&');

    if (reqQuerystring === newReqQuerystring) {
      return;
    }

    let referrer = location.pathname;
    if (newReqQuerystring) {
      referrer += `?${newReqQuerystring}`;
    }

    // Change path
    navigate(
      {
        pathname: location.pathname,
        search: newReqQuerystring,
      },
      {
        state: {
          referrer,
        },
      }
    );
  }, [
    reqQuerystring,
    prevReqQuerystring,
    location.pathname,
    queryStringCriteria,
    history,
  ]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    // Fetch data request
    if (!criteriaIsReady) {
      return;
    }

    let reqPath = path;
    if (currentQueryParams.length) {
      reqPath =
        path +
        '?' +
        encodeURI(
          [...currentQueryParams, ...filterValues, filterByStr].join('&')
        );
    } else if (filterByStr || filterValues.length > 0) {
      reqPath =
        path + '?' + encodeURI([...filterValues, filterByStr].join('&'));
    }

    let page = currentQueryParams.find(
      (str: string) => str.indexOf('_page=') === 0
    );
    if (!page) {
      page = encodeURI(`_page=1`);
      const glue = reqPath.indexOf('?') !== -1 ? '&' : '?';

      reqPath += `${glue}${page}`;
    }

    let itemsPerPage = currentQueryParams.find(
      (str: string) => str.indexOf('_itemsPerPage=') === 0
    );
    if (!itemsPerPage) {
      itemsPerPage = encodeURI(`_itemsPerPage=${defaultItemsPerPage}`);
      const glue = reqPath.indexOf('?') !== -1 ? '&' : '?';

      reqPath += `${glue}${itemsPerPage}`;
    }

    let orderBy = currentQueryParams.find(
      (str: string) => str.indexOf('_order[') === 0
    );
    if (!orderBy && entityService.getOrderBy() !== '') {
      orderBy = encodeURI(
        `_order[${entityService.getOrderBy()}]=${entityService.getOrderDirection()}`
      );

      const glue = reqPath.indexOf('?') !== -1 ? '&' : '?';

      reqPath += `${glue}${orderBy}`;
    }

    apiGet({
      path: reqPath,
      cancelToken,
      successCallback: async (data: any, headers: any) => {
        if (!mounted) {
          return;
        }

        if (headers) {
          setHeaders(headers);
        }

        setRows(data);
        foreignKeyResolver({
          data,
          allowLinks: true,
          entityService,
          cancelToken,
        }).then((data: any) => {
          if (!mounted) {
            return;
          }

          const fixedData = [];
          for (const idx in data) {
            fixedData.push(data[idx]);
          }

          setRows(fixedData);
        });
      },
    });
  }, [
    foreignKeyResolver,
    entityService,
    criteriaIsReady,
    path,
    currentQueryParams,
    apiGet,
    reqQuerystring,
    filterByStr,
    cancelToken,
    mounted,
  ]);

  if (prevPath !== path) {
    return null;
  }

  if (!criteriaIsReady || !mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ListContent
        ref={listRef}
        childEntities={currentRoute?.children || []}
        path={path}
        ignoreColumn={filterBy[0]}
        preloadData={currentQueryParams.length > 0}
        entityService={entityService}
        cancelToken={cancelToken}
        match={match}
        location={location}
        parentEntity={parentEntity}
      />
      <Pagination listRef={listRef} />
      {reqError && <ErrorMessage message={reqError} />}
    </ErrorBoundary>
  );
};

export default List;
