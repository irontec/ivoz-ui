import routeMapParser, {
  RouteMap,
} from '@irontec/ivoz-ui/router/routeMapParser';
import entities from '../entities/index';

const getEntityMap = (): RouteMap => {
  const map: RouteMap = [
    {
      label: 'Instances',
      children: [
        {
          entity: entities.Platform,
          children: [
            {
              entity: entities.Client,
              filterBy: 'platform',
              children: [
                {
                  entity: entities.User,
                  filterBy: 'client',
                  children: [...Object.values(entities.User.customActions)],
                },
                ...Object.values(entities.Client.customActions),
              ],
            },
          ],
        },
        {
          entity: entities.Client,
          children: [
            {
              entity: entities.User,
              filterBy: 'client',
              children: [...Object.values(entities.User.customActions)],
            },
            ...Object.values(entities.Client.customActions),
          ],
        },
      ],
    },
    {
      label: 'General',
      children: [
        {
          entity: entities.Administrator,
        },
      ],
    },
  ];

  return routeMapParser<RouteMap>(map);
};

export default getEntityMap;
