import { Tooltip } from '@mui/material';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { StyledTableRowCta } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';
import buildLink from '../Shared/BuildLink';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';

type EditRowButtonProps = {
  row: Record<string, any>;
  path: string;
};

const ViewRowButton = (props: EditRowButtonProps): JSX.Element => {
  const { row } = props;

  const match = useCurrentPathMatch();
  const link = buildLink({
    link: match.pattern.path,
    params: match.params,
  });

  return (
    <Tooltip title={_('View')} placement='bottom' enterTouchDelay={0} arrow>
      <StyledTableRowCta to={`${link}/${row.id}/detailed`}>
        <PanoramaIcon />
      </StyledTableRowCta>
    </Tooltip>
  );
};

export default ViewRowButton;
