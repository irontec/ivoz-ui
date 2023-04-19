import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Paper, Popover, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '../../../../services';
import { useStoreState } from '../../../../store';
import { LightButton } from '../../../shared/Button/Button.styles';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  children?: React.ReactNode;
}

export default function Settings(props: SettingsProps): JSX.Element {
  const { children } = props;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const languages = useStoreState((state) => state.i18n.languages);

  const choices = languages.map((lang) => {
    return {
      label: lang.name,
      id: lang.locale,
    };
  });

  return (
    <>
      <Tooltip title='settings'>
        <div onClick={handleOpenUserMenu}>
          <LightButton>
            <SettingsOutlinedIcon />
          </LightButton>
        </div>
      </Tooltip>
      <Popover
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children || (
          <Paper sx={{ padding: '10px', minWidth: '300px' }}>
            <Dropdown
              name='language'
              label='Language'
              value={i18n.language}
              required={false}
              disabled={false}
              onChange={(event) => {
                const val = event.target.value;
                i18n.changeLanguage(val);
                navigate(0);
              }}
              onBlur={() => {
                /* noop */
              }}
              choices={choices}
              error={false}
              errorMsg={''}
              helperText={''}
              hasChanged={false}
            />
          </Paper>
        )}
      </Popover>
    </>
  );
}
