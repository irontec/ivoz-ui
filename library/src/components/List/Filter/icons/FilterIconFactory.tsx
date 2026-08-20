import Contains from './contains';
import StartsWith from './startsWith';
import EndsWith from './endsWith';
import Equals from './equals';
import NotEquals from './notEquals';
import LowerThan from './lowerThan';
import LowerThanEqual from './lowerThanEqual';
import GreaterThan from './greaterThan';
import GreaterThanEqual from './greaterThanEqual';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BlockIcon from '@mui/icons-material/Block';
import RuleIcon from '@mui/icons-material/Rule';
import _ from '../../../../services/translations/translate';
import { styled } from '@mui/material';

export type OrderFilterType = string;
export type SearchFilterType =
  | OrderFilterType
  | ''
  | 'exists'
  | 'partial'
  | 'start'
  | 'end'
  | 'in'
  | 'all'
  | 'none'
  | 'only'
  | 'exact'
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'between';

interface FilterIconFactoryProps {
  name: SearchFilterType;
  className?: string;
  fontSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
  includeLabel?: boolean;
  /**
   * Over a to-many association `in` means "holds any of the given values", which
   * reads nothing like the "Equals" of a plain foreign key
   */
  collection?: boolean;
}

export default function FilterIconFactory(
  props: FilterIconFactoryProps
): JSX.Element {
  const { name, includeLabel, collection, ...rest } = props;

  const icon = getFilterIcon(name);
  const StyledIcon = styled(icon as any)(() => {
    return {
      verticalAlign: 'bottom',
      paddingRight: '7px',
    };
  });

  if (!includeLabel) {
    return <StyledIcon {...rest} />;
  }

  return (
    <span>
      <StyledIcon {...rest} />
      {getFilterLabel(name, collection)}
    </span>
  );
}

const getFilterIcon = (name: string): React.FunctionComponent => {
  switch (name) {
    case 'exists':
      return AssignmentTurnedInIcon;
    case 'partial':
      return Contains;
    case 'start':
      return StartsWith;
    case 'end':
      return EndsWith;
    case '':
    case 'in':
      return Equals;
    case 'all':
      return DoneAllIcon;
    case 'none':
      return BlockIcon;
    case 'only':
      return RuleIcon;
    case 'exact':
    case 'eq':
      return Equals;
    case 'neq':
      return NotEquals;
    case 'strictly_before':
    case 'lt':
      return LowerThan;
    case 'before':
    case 'lte':
      return LowerThanEqual;
    case 'strictly_after':
    case 'gt':
      return GreaterThan;
    case 'after':
    case 'gte':
      return GreaterThanEqual;
    case 'between':
      return Contains;
    default:
      const error = { error: `Icon ${name} was not found` };
      throw error;
  }
};

export const getFilterLabel = (
  value: string,
  collection = false
): JSX.Element => {
  if (collection && (value === 'in' || value === '' || value === 'exact')) {
    return _('Has any of');
  }

  const filterTypes: { [key: string]: JSX.Element } = {
    '': _('Equals'),
    in: _('Equals'),
    all: _('Has all of'),
    none: _('Has none of'),
    only: _('Has exactly'),
    eq: _('Equals'),
    exact: _('Equals'),
    neq: _('Does not Equal'),
    start: _('Starts with'),
    partial: _('Contains'),
    end: _('Ends with'),
    gt: _('Is greater than'),
    between: _('Between'),
    gte: _('Is greater than equal'),
    after: _('Is greater than equal'),
    strictly_after: _('Is greater than'),
    lt: _('Is lower than'),
    lte: _('Is lower than equal'),
    before: _('Is lower than equal'),
    strictly_before: _('Is lower than'),
    exists: _('Exists'),
  };

  return filterTypes[value];
};
