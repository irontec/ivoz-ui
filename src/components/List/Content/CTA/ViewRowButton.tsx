import { Tooltip } from '@mui/material';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { useLocation, useMatch, PathMatch } from 'react-router-dom';
import { StyledTableRowCta } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';
import buildLink from '../Shared/BuildLink';

type EditRowButtonProps = {
  row: Record<string, any>;
  path: string;
};

const ViewRowButton = (props: EditRowButtonProps): JSX.Element => {
  const { row } = props;

  const location = useLocation();
  const match = useMatch(location.pathname) as PathMatch;

  const link = buildLink(match.pathname, match);

  return (
    <Tooltip title={_('View')} placement='bottom' enterTouchDelay={0}>
      <StyledTableRowCta to={`${link}/${row.id}/detailed`}>
        <PanoramaIcon />
      </StyledTableRowCta>
    </Tooltip>
  );
};

export default ViewRowButton;
