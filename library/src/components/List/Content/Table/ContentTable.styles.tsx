import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableCell, TableCellProps, styled } from '@mui/material';
import { forwardRef } from 'react';
import { LightButton } from '../../../../components/shared/Button/Button.styles';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../../../components/shared/HistoryTrackerLink';

const linkSharedStyles = {
  cursor: 'pointer',
};

const TableRowLinkButton = forwardRef<any, any>((props, ref) => {
  const { children, className, to, ...rest } = props;
  return (
    <HistoryTrackerLink {...rest} to={to} className={className} ref={ref}>
      <LightButton>{children}</LightButton>
    </HistoryTrackerLink>
  );
});
TableRowLinkButton.displayName = 'TableRowLinkButton';

export const StyledTableRowCta = styled(TableRowLinkButton)(() => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
  };
});

export const StyledTableRowCustomCta = LightButton;

export const StyledTableRowEntityCta = styled(TableRowLinkButton)(() => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
  };
});

export const StyledTableRowFkLink = styled((props: HistoryTrackerLinkProps) => {
  const { children, className, to } = props;
  return (
    <HistoryTrackerLink to={to} className={`link ${className}`}>
      {children}
    </HistoryTrackerLink>
  );
})(() => {
  return linkSharedStyles;
});

const _DeleteIcon = forwardRef<any, any>((props, ref) => {
  const { className, onClick, ...rest } = props;
  return (
    <DeleteIcon {...rest} className={className} onClick={onClick} ref={ref} />
  );
});
_DeleteIcon.displayName = '_DeleteIcon';

export const StyledDeleteIcon = styled(_DeleteIcon)(() => {
  return linkSharedStyles;
});

export const StyledCheckBoxIcon = styled(CheckBoxIcon)(() => {
  return {
    color: '#aaa',
    verticalAlign: 'bottom',
    fontSize: '1.3em',
  };
});

export const StyledCheckBoxOutlineBlankIcon = styled(CheckBoxOutlineBlankIcon)(
  () => {
    return {
      color: '#aaa',
      fontSize: '1.3em',
    };
  }
);

interface TableCellPropsWithKey extends TableCellProps {
  key: string | number;
}

export const StyledTable = styled(Table)(() => {
  return {
    tableLayout: 'fixed',
  };
});

export const StyledTableCell = styled((props: TableCellPropsWithKey) => {
  const { children, className, key, ...rest } = props;
  return (
    <TableCell key={key} className={className} {...rest}>
      {children}
    </TableCell>
  );
})(() => {
  return {
    overflowWrap: 'break-word',
  };
});

export const StyledActionsTableCell = styled((props: TableCellPropsWithKey) => {
  const { children, className, key } = props;
  return (
    <TableCell key={key} className={className}>
      {children}
    </TableCell>
  );
})(() => {
  return {
    textAlign: 'right',
    paddingRight: '8px',
  };
});
