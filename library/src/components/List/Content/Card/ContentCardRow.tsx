import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Typography } from '@mui/material';
import { PropertySpec } from '../../../../services';
import EntityService, {
  EntityValues,
} from '../../../../services/entity/EntityService';
import ListContentValue from '../ListContentValue';
import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';
import { CardSelector } from './CardSelector';

interface ContentCardProps {
  columnName: string;
  multiselect: boolean;
  isFirstRow: boolean;
  column: PropertySpec;
  row: EntityValues;
  entityService: EntityService;
  selectedValues: string[];
  handleMultiselectChange: handleMultiselectChangeType;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}

const ContentCardRow = (props: ContentCardProps): JSX.Element => {
  const {
    columnName,
    multiselect,
    isFirstRow,
    column,
    row,
    selectedValues,
    entityService,
    handleMultiselectChange,
    expanded,
    setExpanded,
  } = props;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const expandIconClass = expanded ? 'expanded' : '';
  return (
    <Box>
      {multiselect && isFirstRow && (
        <CardSelector
          row={row}
          selectable={multiselect}
          selectedValues={selectedValues}
          handleChange={handleMultiselectChange}
        />
      )}
      <Typography onClick={toggleExpanded} sx={{ display: 'flex' }}>
        <span>{column.label}:</span>
        <ListContentValue
          columnName={columnName}
          column={column}
          row={row}
          entityService={entityService}
        />
      </Typography>
      {isFirstRow && (
        <ExpandMoreIcon onClick={toggleExpanded} className={expandIconClass} />
      )}
    </Box>
  );
};

export default ContentCardRow;
