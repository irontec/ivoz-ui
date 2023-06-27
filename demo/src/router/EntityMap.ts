import routeMapParser, {
  RouteMap,
  RouteMapItem,
} from '@irontec/ivoz-ui/router/routeMapParser';
import { HatIcon } from 'icons/HatIcon';

import entities from '../entities/index';

const getEntityMap = (): RouteMap => {
  const map: RouteMap = [
    {
      entity: entities.Platform,
      divider: true,
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
    {
      label: 'More',
      icon: HatIcon,
      children: [
        {
          entity: entities.Blank,
          divider: true,
        },
        {
          entity: {
            ...entities.Platform,
            localPath: '/platform_edit_only/2',
            title: 'Edit only platform 2',
            acl: {
              create: false,
              update: false,
              detail: false,
              read: false,
              delete: false,
            },
          },
          divider: false,
        },
        {
          entity: {
            ...entities.Client,
            localPath: '/client_edit_only/2',
            title: 'Edit only client 2',
            acl: {
              create: false,
              update: false,
              detail: false,
              read: false,
              delete: false,
            },
          },
          divider: false,
        },
        {
          entity: {
            ...entities.Client,
            localPath: '/client_create_only',
            title: 'Create only client',
            acl: {
              create: false,
              update: false,
              detail: false,
              read: false,
              delete: false,
            },
          },
          divider: false,
        },
      ],
    },
  ];

  const routeMap = routeMapParser<RouteMapItem>(map);

  return routeMap;
};

export default getEntityMap;
