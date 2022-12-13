import TranslateIcon from '@mui/icons-material/Translate';
import {
  Avatar,
  IconButton,
  Menu,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = {
  name: string;
  locale: string;
};

export type Languages = Array<Language>;

interface LanguageSelectorProps {
  languages: Languages;
}

export default function LanguageSelector(
  props: LanguageSelectorProps
): JSX.Element {
  const { languages } = props;
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const handleChangeLanguage = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: string
  ) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    handleCloseMenu();
  };

  return (
    <>
      <Tooltip title='Translate'>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0, mr: '10px' }}>
          <Avatar
            sx={{
              width: '30px',
              height: '30px',
              bgcolor: 'white',
              color: 'primary.main',
            }}
          >
            <TranslateIcon fontSize='small' />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id='menu-appbar'
        sx={{ mt: '45px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={handleCloseMenu}
      >
        <ToggleButtonGroup
          size='small'
          value={language}
          onChange={handleChangeLanguage}
          orientation={languages.length > 6 ? 'vertical' : 'horizontal'}
          exclusive
        >
          {languages?.map((lng, idx) => (
            <ToggleButton
              key={idx}
              sx={{ border: 'none', textTransform: 'none' }}
              value={lng.locale}
            >
              {lng.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Menu>
    </>
  );
}
