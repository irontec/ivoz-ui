import React from 'react';
import { PropertySpec, isPropertyFk } from "../../../../services/api/ParsedApiSpecInterface";
import EntityService from 'services/entity/EntityService';
import { StyledTableCell } from './ContentTable.styles';
import ListContentValue from '../ListContentValue';
import { handleMultiselectChangeType } from './hook/useMultiselectState';

interface TableTableColumnProps {
  columnName: string,
  entityService: EntityService,
  row: Record<string, any>,
  column: PropertySpec,
  selectable: boolean,
  selectedValues: string[],
  handleChange: handleMultiselectChangeType,
}

export const TableTableColumn = (props: TableTableColumnProps) => {

  const {columnName, column, row, entityService, selectable} = props;
  const {selectedValues, handleChange} = props;

  const checked = selectedValues.indexOf(row.id.toString()) > -1;

  return (
    <StyledTableCell>
      {selectable && (
        <input
          type="checkbox"
          style={{verticalAlign: 'bottom', marginRight: '10px'}}
          name={row.id}
          checked={checked}
          onChange={handleChange}
        />
      )}
      <ListContentValue
        columnName={columnName}
        column={column}
        row={row}
        entityService={entityService}
      />
    </StyledTableCell>
  );
}

export const TableTableColumnMemo = React.memo(
  TableTableColumn,
  (prev: TableTableColumnProps, next: TableTableColumnProps): boolean => {

      const column = prev.column;
      const columnName = prev.columnName;

      if (column.memoize === false) {
          return false;
      }

      if (isPropertyFk(column)) {
        return false;
      }

      return prev.row[columnName] === next.row[columnName];
  }
);