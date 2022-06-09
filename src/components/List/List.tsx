/* eslint-disable no-script-url */

import { useState, useEffect, createRef } from 'react';
import { useStoreActions, useStoreState } from '../../store';
import { withRouter, RouteComponentProps } from "react-router-dom";
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

type ListProps = RouteComponentProps<any, any, Record<string, string>> & {
    path: string,
    routeMap: RouteMap,
    entityService: EntityService,
    foreignKeyResolver: foreignKeyResolverType
}

const List = function (props: ListProps) {

    const {
        path, history, foreignKeyResolver, entityService, routeMap, match, location
    } = props;

    const listRef = createRef();

    const currentRoute = findRoute(routeMap, match);
    const parentEntity = findParentEntity(routeMap, match);

    const resetList = useStoreActions((actions: any) => {
        return actions.list.reset
    });
    useEffect(
        () => {
            resetList();
        },
        []
    );

    const setRows = useStoreActions((actions: any) => {
        return actions.list.setRows
    });

    const setHeaders = useStoreActions((actions: any) => {
        return actions.list.setHeaders
    });

    const reqError = useStoreState((store) => store.api.errorMsg);
    const apiGet = useStoreActions((actions: any) => {
        return actions.api.get
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

    ////////////////////////////
    // Filters
    ////////////////////////////
    const currentQueryParams = useQueryStringParams();
    const filterBy: Array<string> = [];

    if (currentRoute?.filterBy) {
        filterBy.push(
            currentRoute.filterBy
        );
        filterBy.push(
            Object.values(match.params).pop() as string
        );
    }
    const filterByStr = filterBy.join('[]=');
    const reqQuerystring = currentQueryParams.join('&');
    const [prevReqQuerystring, setPrevReqQuerystring] = useState<string | null>(null); //38

    useEffect(
        () => {

            // Path change listener
            if (reqQuerystring === prevReqQuerystring) {
                return;
            }

            setPrevReqQuerystring(reqQuerystring);
            const criteria = queryStringToCriteria();
            setQueryStringCriteria(criteria);
            setCriteriaIsReady(true);
        },
        [
            reqQuerystring, prevReqQuerystring, setPrevReqQuerystring,
            setQueryStringCriteria, setCriteriaIsReady
        ]
    );

    useEffect(
        () => {

            // Criteria change listener
            if (reqQuerystring !== prevReqQuerystring) {
                return;
            }

            const newReqQuerystring = criteriaToArray(queryStringCriteria).join('&');

            if (reqQuerystring === newReqQuerystring) {
                return;
            }

            // Change path
            history.push(
                {
                    pathname: location.pathname,
                    search: newReqQuerystring,
                },
                {
                    referrer: history.location.pathname + newReqQuerystring,
                }
            );
        },
        [
            reqQuerystring, prevReqQuerystring, location.pathname, queryStringCriteria,
            history
        ]
    );

    useEffect(
        () => {

            if (!mounted) {
                return;
            }

            // Fetch data request
            if (!criteriaIsReady) {
                return;
            }

            let reqPath = path;
            if (currentQueryParams.length) {
                reqPath = path + '?' + encodeURI([...currentQueryParams, filterByStr].join('&'));
            } else if (filterByStr) {
                reqPath = path + '?' + encodeURI(filterByStr);
            }

            let itemsPerPage = currentQueryParams.find(
                (str: string) => str.indexOf('_itemsPerPage[') === 0
            );
            if (!itemsPerPage) {
                itemsPerPage = encodeURI(
                    `_itemsPerPage=${defaultItemsPerPage}`
                );
                const glue = filterByStr || currentQueryParams.length > 0
                    ? '&'
                    : '?';

                reqPath += `${glue}${itemsPerPage}`;
            }

            let orderBy = currentQueryParams.find(
                (str: string) => str.indexOf('_order[') === 0
            );
            if (!orderBy && entityService.getOrderBy() !== '') {
                orderBy = encodeURI(
                    `_order[${entityService.getOrderBy()}]=${entityService.getOrderDirection()}`
                );
                const glue = filterByStr || currentQueryParams.length > 0
                    ? '&'
                    : '?';

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
                    foreignKeyResolver({ data, allowLinks: true, entityService, cancelToken })
                        .then((data: any) => {

                            if (!mounted) {
                                return;
                            }

                            const fixedData = [];
                            for (const idx in data) {
                                fixedData.push(
                                    data[idx],
                                );
                            }

                            setRows(fixedData);
                        });
                }
            });
        },
        [
            foreignKeyResolver, entityService, criteriaIsReady,
            path, currentQueryParams, apiGet, reqQuerystring,
            filterByStr, cancelToken, mounted
        ]
    );

    if (!criteriaIsReady || !mounted) {
        return null;
    }

    return (
        <>
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
            <Pagination
                listRef={listRef}
            />
            {reqError && <ErrorMessage message={reqError} />}
        </>

    );
}

export default withRouter(List);