import routeMapParser, {
  RouteMap,
  RouteMapItem,
} from '@irontec/ivoz-ui/router/routeMapParser';
import { HatIcon } from 'icons/HatIcon';

import entities from '../entities/index';

const getEntityMap = (): RouteMap => {
  const map: RouteMap = [
    {
      entity: entities.Blank,
      divider: true,
    },
    {
      entity: entities.Blank2,
      divider: false,
    },
    {
      label: 'Instances',
      icon: HatIcon,
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
            ...Object.values(entities.Platform.customActions),
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
            {
              entity: entities.Administrator,
            },
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
        {
          entity: entities.Feature,
        },
        {
          entity: entities.Language,
        },
      ],
    },
  ];

  return routeMapParser<RouteMapItem>(map);
};

export default getEntityMap;
