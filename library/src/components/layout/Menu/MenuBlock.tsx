import { useLocation, useNavigate } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../../store';
import {
  EntityItem,
  isActionItem,
  isEntityItem,
  RouteMapBlock,
  RouteMapItem,
} from '../../../router/routeMapParser';

import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledList,
  StyledListItemIcon,
} from './MenuBlock.styles';
import MenuListItem from './MenuListItem';

interface menuBlockProps {
  idx: number;
  routeMapBlock: RouteMapItem | RouteMapBlock;
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {
  const { idx, routeMapBlock } = props;
  

  const navigate = useNavigate();
  const location = useLocation();

  const open = useStoreState((store) => store.menu.open);
  const expandMenu = useStoreActions((actions) => actions.menu.expand);
  const colapseMenu = useStoreActions((actions) => actions.menu.colapse);

  if (isEntityItem(routeMapBlock as RouteMapItem)) {
    const entity = (routeMapBlock as EntityItem).entity;
    return (
      <MenuListItem 
        path={entity.path}
        icon={(<entity.icon />)}
        text={entity.title}
      />
    );
  }

  const { label, children } = routeMapBlock as RouteMapBlock;

  return (
    <StyledList>
      <StyledAccordion
        expanded={open.includes(idx)}
        onChange={(event: React.SyntheticEvent, expanded: boolean) => {
          if (!expanded) {
            colapseMenu(idx);
            return;
          }
          expandMenu(idx);
          for (const value of open) {
            if (value !== idx) {
              colapseMenu(value);
            }
          }
        }}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem key={'label'} disablePadding>
            <strong style={{ fontSize: '0.8em' }}>{label}</strong>
          </ListItem>
        </StyledAccordionSummary>
        {(children || []).map((item: RouteMapItem, key: number) => {
          if (isActionItem(item)) {
            return null;
          }

          const { route, entity } = item;

          if (!entity) {
            return null;
          }

          if (!route) {
            return null;
          }

          return (
            <StyledAccordionDetails key={key}>
              <ListItem disablePadding>
                <ListItemButton
                  dense={true}
                  selected={location.pathname.indexOf(route) === 0}
                  onClick={() => {
                    navigate(route, {
                      state: {
                        referrer: location.pathname,
                      },
                    });
                  }}
                >
                  <StyledListItemIcon>
                    <entity.icon />
                  </StyledListItemIcon>
                  <ListItemText primary={entity.title} />
                </ListItemButton>
              </ListItem>
            </StyledAccordionDetails>
          );
        })}
      </StyledAccordion>
    </StyledList>
  );
}
