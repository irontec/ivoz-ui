import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from 'store/i18n';
import StyledMenu from './styles/Menu.styles';
import StyledToggleButton from './styles/ToggleButton.styles';
import { TranslateButton } from './TranslateButton';

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
      <TranslateButton onClick={handleOpenMenu} />
      <StyledMenu
        id='menu-appbar'
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
            <StyledToggleButton key={idx} value={lng.locale}>
              {lng.name}
            </StyledToggleButton>
          ))}
        </ToggleButtonGroup>
      </StyledMenu>
    </>
  );
}
