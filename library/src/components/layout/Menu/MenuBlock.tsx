import { useLocation, useNavigate } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../../store';
import {
  isActionItem,
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

interface menuBlockProps {
  idx: number;
  routeMapBlock: RouteMapBlock;
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {
  const { idx, routeMapBlock } = props;
  const { label, children } = routeMapBlock;

  const navigate = useNavigate();
  const location = useLocation();

  const open = useStoreState((store) => store.menu.open);
  const expandMenu = useStoreActions((actions) => actions.menu.expand);
  const colapseMenu = useStoreActions((actions) => actions.menu.colapse);

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
