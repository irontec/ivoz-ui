import DehazeIcon from '@mui/icons-material/Dehaze';
import { Button } from '@mui/material';
import { useStoreActions } from 'store';

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
    <div className={className}>
      <p>Logo</p>
      <Button variant='contained' onClick={onClickHandler}>
        <DehazeIcon />
      </Button>
    </div>
  );
}
