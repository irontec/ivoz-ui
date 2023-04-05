import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import MenuContent, { MenuContentProps } from './MenuContent';
import { useStoreState, useStoreActions } from 'store';

export default function Menu(props: MenuContentProps): JSX.Element | null {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const hidden = useStoreState((state) => state.menu.hidden);
  const toggleVisibility = useStoreActions(
    (actions) => actions.menu.toggleVisibility
  );

  if (desktop) {
    return <MenuContent {...props} />;
  }

  return (
    <Drawer
      anchor='left'
      open={!hidden}
      onClose={() => {
        toggleVisibility();
      }}
    >
      <MenuContent {...props} />
    </Drawer>
  );
}
