import { Box, Divider, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { RouteMap } from '../../../router/routeMapParser';
import MenuBlock from './MenuBlock';
import MenuHead from './MenuHead';

interface menuProps {
  routeMap: RouteMap;
}

export default function Menu(props: menuProps): JSX.Element | null {
  const { routeMap } = props;

  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

  if (!bigScreen) {
    return null;
  }

  const width = 225;

  return (
    <Drawer
      variant='permanent'
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
      <Box sx={{ overflow: 'auto' }}>
        <MenuHead />
        {routeMap.map((routeMapBlock, key: number) => {
          const lastItem = key === routeMap.length - 1;

          const styles: Record<string, string> = { paddingLeft: '10px' };
          if (key === 0) {
            styles.marginTop = '23px';
          }

          return (
            <div key={key} style={styles}>
              <MenuBlock idx={key} routeMapBlock={routeMapBlock} />
              {!lastItem && <Divider sx={{ width: '90%' }} />}
            </div>
          );
        })}
      </Box>
    </Drawer>
  );
}
