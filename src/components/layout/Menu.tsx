import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { RouteMap } from '../../router/routeMapParser';

interface menuProps {
  loggedIn: boolean,
  routeMap: RouteMap
}

export default function Menu(props: menuProps): JSX.Element {

  const { loggedIn, routeMap } = props;
  const width = 240;

  return (
    <Drawer
        variant="permanent"
        sx={{
            width,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width,
                boxSizing: 'border-box',
                borderRight: 'none',
            },
        }}
    >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List sx={{marginTop: '10px'}}>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            <Divider sx={{width: '90%'}}/>
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Box>
  </Drawer>
  );
}