import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation, useMatch, PathMatch } from 'react-router-dom';
import { StyledTableRowCta } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';
import buildLink from '../Shared/BuildLink';

type EditRowButtonProps = {
  row: Record<string, any>;
  path: string;
};

const EditRowButton = (props: EditRowButtonProps): JSX.Element => {
  const { row } = props;

  const location = useLocation();
  const match = useMatch(location.pathname) as PathMatch;

  const link = buildLink(match.pathname, match);

  return (
    <Tooltip title={_('Edit')} placement='bottom'>
      <StyledTableRowCta to={`${link}/${row.id}/update`}>
        <EditIcon />
      </StyledTableRowCta>
    </Tooltip>
  );
};

export default EditRowButton;
