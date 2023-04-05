import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
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

  return (
    <div>
      {multiselect && isFirstRow && (
        <CardSelector
          row={row}
          selectable={multiselect}
          selectedValues={selectedValues}
          handleChange={handleMultiselectChange}
        />
      )}
      <Typography>
        <strong>{column.label}:</strong>
        &nbsp;
        <ListContentValue
          columnName={columnName}
          column={column}
          row={row}
          entityService={entityService}
        />
      </Typography>
      {isFirstRow && (
        <div onClick={toggleExpanded}>
          <ExpandMoreIcon />
        </div>
      )}
    </div>
  );
};

export default ContentCardRow;
