import { Menu, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from 'store/i18n';
import { StyledTranslateButton } from './styles';

interface LanguageSelectorProps {
  languages: Language[];
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
      <StyledTranslateButton onClick={handleOpenMenu} />
      <Menu
        id='menu-appbar'
        sx={{ marginTop: '45px' }}
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
