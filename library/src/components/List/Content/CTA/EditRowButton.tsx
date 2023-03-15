import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { StyledTableRowCta } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';
import buildLink from '../Shared/BuildLink';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';

type EditRowButtonProps = {
  row: Record<string, any>;
  path: string;
};

const EditRowButton = (props: EditRowButtonProps): JSX.Element => {
  const { row } = props;

  const match = useCurrentPathMatch();
  const link = buildLink({
    link: match.pattern.path,
    params: match.params,
  });

  return (
    <Tooltip title={_('Edit')} placement='bottom' arrow>
      <StyledTableRowCta to={`${link}/${row.id}/update`}>
        <EditIcon />
      </StyledTableRowCta>
    </Tooltip>
  );
};

export default EditRowButton;
