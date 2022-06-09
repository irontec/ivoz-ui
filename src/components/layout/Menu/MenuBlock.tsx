import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useHistory } from "react-router-dom";
import { isActionItem, RouteMapBlock, RouteMapItem } from '../../../router/routeMapParser';

interface menuBlockProps {
  routeMapBlock: RouteMapBlock
}

export default function MenuBlock(props: menuBlockProps): JSX.Element {

  const { routeMapBlock } = props;
  const { label, children } = routeMapBlock;
  const history = useHistory();

  return (
    <List sx={{marginTop: '10px'}}>
      <ListItem key={'label'} disablePadding>
        <strong style={{fontSize: '0.8em'}}>{label}</strong>
      </ListItem>
      {(children || []).map((item: RouteMapItem, key: number) => {

        if (isActionItem(item)) {
          return null;
        }

        const { route, entity } = item;

        if (!entity) {
          return null;
        }

        const styles = key === 0
          ? {paddingTop: 0}
          : {};

        return (
          <ListItem key={key} disablePadding sx={styles}>
            <ListItemButton dense={true} onClick={() => { history.push(route || '', {referrer: history.location.pathname }); }}>
              <ListItemIcon sx={{minWidth: 0, marginRight: '10px',}}>
                <entity.icon />
              </ListItemIcon>
              <ListItemText primary={entity.title} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}