import { Divider } from '@mui/material';
import { StyledList } from './MenuBlock.styles';
import { StyledHomeIcon } from './MenuHead.styles';
import MenuListItem from './MenuListItem';

export default function MenuHead(): JSX.Element | null {

  return (
    <div key='Dashboard' style={{ marginTop: 25 }}>
      <StyledList>
        <MenuListItem 
          path="/"
          icon={(<StyledHomeIcon />)}
          text={'Dashboard'}
        />
      </StyledList>
      <Divider sx={{ width: '90%' }} />
    </div>
  );
}
