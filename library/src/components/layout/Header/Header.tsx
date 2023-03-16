import { Box, MenuItem, Typography } from '@mui/material';
import { RouteMap } from '../../../router/routeMapParser';
import { useStoreActions, useStoreState } from '../../../store';
import AccountSettings from './AccountSettings/AccountSettings';
import Breadcrumbs from './Breadcrumbs';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import { StyledMenuContainer } from './styles/MenuContainer.styles';

interface headerProps {
  routeMap: RouteMap;
  children?: React.ReactNode;
  customAvatar?: JSX.Element;
}

export default function Header(props: headerProps): JSX.Element {
  const { routeMap, children, customAvatar } = props;
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const handleLogout = () => {
    resetAuth();
  };
  const languages = useStoreState((state) => state.i18n.languages);

  return (
    <StyledMenuContainer>
      <Breadcrumbs routeMap={routeMap} />
      <Box>
        {languages && <LanguageSelector languages={languages} />}
        <AccountSettings customAvatar={customAvatar}>
          {children || (
            <MenuItem key='logout' onClick={handleLogout}>
              <Typography textAlign='center'>Logout</Typography>
            </MenuItem>
          )}
        </AccountSettings>
      </Box>
    </StyledMenuContainer>
  );
}
