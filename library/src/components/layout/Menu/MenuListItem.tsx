import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledListItemIcon } from './MenuBlock.styles';

type MenuListItemProps = {
  path: string,
  icon: React.ReactNode,
  text: React.ReactNode,
}

export default function MenuListItem(props: MenuListItemProps): JSX.Element | null {

  const { path, icon, text } = props;
  const navigate = useNavigate();

  return (
    <ListItem disablePadding>
      <ListItemButton
        dense={true}
        selected={location.pathname === path}
        onClick={() => {
          navigate(path, {
            state: {
              referrer: location.pathname,
            },
          });
        }}
      >
        <StyledListItemIcon>
          {icon}
        </StyledListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
