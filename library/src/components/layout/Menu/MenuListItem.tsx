import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type MenuListItemProps = {
  path: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  className?: string;
};

export default function MenuListItem(
  props: MenuListItemProps
): JSX.Element | null {
  const { path, icon, text, className } = props;
  const navigate = useNavigate();

  const selected =
    location.pathname === path || location.pathname.indexOf(`${path}/`) === 0;

  return (
    <ListItemButton
      className={className}
      dense={true}
      selected={selected}
      onClick={() => {
        navigate(path, {
          state: {
            referrer: location.pathname,
          },
        });
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}
