import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { StyledTableRowCta } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';
import buildLink from '../Shared/BuildLink';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';

type EditRowButtonProps = {
  row: Record<string, any>;
  path: string;
  disabled?: boolean;
};

const EditRowButton = (props: EditRowButtonProps): JSX.Element | null => {
  const { row, disabled = false } = props;

  const match = useCurrentPathMatch();
  const link = buildLink({
    link: match.pattern.path,
    params: match.params,
  });

  return (
    <Tooltip title={_('Edit')} placement='bottom' arrow>
      <span>
        <StyledTableRowCta disabled={disabled} to={`${link}/${row.id}/update`}>
          <EditIcon />
        </StyledTableRowCta>
      </span>
    </Tooltip>
  );
};

export default EditRowButton;
