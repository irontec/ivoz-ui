import { Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledList, StyledListItemIcon } from './MenuBlock.styles';
import { StyledHomeIcon } from './MenuHead.styles';

export default function MenuHead(): JSX.Element | null {
  const navigate = useNavigate();

  return (
    <div key='Dashboard' style={{ marginTop: 25 }}>
      <StyledList>
        <ListItem disablePadding>
          <ListItemButton
            dense={true}
            selected={location.pathname === '/'}
            onClick={() => {
              navigate('/', {
                state: {
                  referrer: location.pathname,
                },
              });
            }}
          >
            <StyledListItemIcon>
              <StyledHomeIcon />
            </StyledListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItemButton>
        </ListItem>
      </StyledList>
      <Divider sx={{ width: '90%' }} />
    </div>
  );
}
