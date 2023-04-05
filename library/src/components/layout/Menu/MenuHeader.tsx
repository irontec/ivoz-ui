import DehazeIcon from '@mui/icons-material/Dehaze';
import { useStoreActions } from 'store';
import { LightButton } from '../../../components/shared/Button/Button.styles';

export interface MenuHeaderProps {
  className?: string;
}

export default function MenuHeader(props: MenuHeaderProps): JSX.Element | null {
  const { className } = props;

  const toggleMenuVariant = useStoreActions(
    (actions) => actions.menu.toggleVariant
  );

  const onClickHandler = () => {
    toggleMenuVariant();
  };

  return (
    <div className='menu-header'>
      <img src='./logo.svg' />

      <LightButton onClick={onClickHandler}>
        <DehazeIcon />
      </LightButton>
    </div>
  );
}
