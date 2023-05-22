import { Tooltip } from '@mui/material';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import { EntityItem } from '../../../../router';
import { StyledTableRowEntityCta } from '../Table/ContentTable.styles';
import buildLink from './BuildLink';

type ChildEntityLinkProps = {
  row: Record<string, any>;
  routeMapItem: EntityItem;
  disabled?: boolean,
};

const ChildEntityLink = (props: ChildEntityLinkProps): JSX.Element => {
  const { routeMapItem, row, disabled = false } = props;

  const match = useCurrentPathMatch();

  const entity = routeMapItem.entity;
  const Icon = entity.icon as React.FunctionComponent;
  const title = entity.title as JSX.Element;
  const baseUrl = process.env.BASE_URL || '/';

  const link = buildLink({
    link: `${baseUrl}${routeMapItem.route?.substring(1)}`,
    id: row.id,
    params: match.params,
  });

  return (
    <Tooltip
      title={title}
      placement='bottom-start'
      enterTouchDelay={0}
      arrow
    >
      <span>
        <StyledTableRowEntityCta
          to={link}
          parentEntity={entity}
          parentRow={row}
          disabled={disabled}
        >
          <Icon />
        </StyledTableRowEntityCta>
      </span>
    </Tooltip>
  );
};

export default ChildEntityLink;