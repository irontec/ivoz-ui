import DehazeIcon from '@mui/icons-material/Dehaze';
import { useStoreActions, useStoreState } from 'store';
import { LightButton } from '../../../components/shared/Button/Button.styles';
import { useMediaQuery, useTheme } from '@mui/material';
import Avatar from '../Header/Avatar';

export default function MenuHeader(): JSX.Element {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const toggleMenuVariant = useStoreActions(
    (actions) => actions.menu.toggleVariant
  );
  const logo = useStoreState((state) => state.theme.logo);

  const onClickHandler = () => {
    toggleMenuVariant();
  };

  return (
    <div className='menu-header'>
      <img src={logo || './logo.svg'} />

      {desktop && (
        <LightButton onClick={onClickHandler}>
          <DehazeIcon />
        </LightButton>
      )}

      {!desktop && <Avatar />}
    </div>
  );
}
