import React from 'react';
import EntityService from 'services/entity/EntityService';
import {
  PropertySpec,
  isPropertyFk,
} from '../../../../services/api/ParsedApiSpecInterface';
import ListContentValue from '../ListContentValue';
import { StyledTableCell } from './ContentTable.styles';
import { useStoreState } from 'store';

interface TableColumnProps {
  columnName: string;
  entityService: EntityService;
  row: Record<string, any>;
  column: PropertySpec;
}

export const TableColumn = (props: TableColumnProps) => {
  const { columnName, column, row, entityService } = props;

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const size = entityService.getColumnSize(columnName, storeState);

  return (
    <StyledTableCell key={row.id} style={{ width: `${size}%` }}>
      <ListContentValue
        columnName={columnName}
        column={column}
        row={row}
        entityService={entityService}
      />
    </StyledTableCell>
  );
};

export const TableColumnMemo = React.memo(
  TableColumn,
  (prev: TableColumnProps, next: TableColumnProps): boolean => {
    const column = prev.column;
    const columnName = prev.columnName;

    if (column.memoize === false) {
      return false;
    }

    if (column.component) {
      return false;
    }

    if (isPropertyFk(column)) {
      return false;
    }

    return prev.row[columnName] === next.row[columnName];
  }
);
