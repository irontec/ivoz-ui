import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableCell, TableCellProps, styled } from '@mui/material';
import { forwardRef } from 'react';
import { LightButton } from '../../../../components/shared/Button/Button.styles';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../../../components/shared/HistoryTrackerLink';
import ContentTable from './ContentTable';

const linkSharedStyles = {
  cursor: 'pointer',
};

export const StyledContentTable = styled(ContentTable)(() => {
  return {
    width: '100%',

    '& th': {
      color: 'var(--color-text)',
      fontWeight: 'normal',
      fontSize: '15px',
      whiteSpace: 'nowrap',
    },
    '& tbody': {
      '& tr': {
        borderTop: '1px solid var(--color-border)',
      },
      '& tr:hover': {
        backgroundColor: 'var(--color-primary-tonal)',
      },
      '& td': {
        fontSize: '16px',
      },
    },
    '& .MuiTableCell-root': {
      border: 0,
      padding: '8px',
      paddingInline: 'var(--spacing-md)',
    },
    '& .actions-cell': {
      display: 'flex',
      gap: 'var(--spacing-sm)',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  };
});

const TableRowLinkButton = forwardRef<any, any>((props, ref) => {
  const { children, className, to, disabled, ...rest } = props;

  if (disabled) {
    return <LightButton disabled={disabled}>{children}</LightButton>;
  }

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

export const StyledTableRowChildEntityLink = styled(
  (props: HistoryTrackerLinkProps) => {
    const { children, className, to, ...rest } = props;

    return (
      <HistoryTrackerLink {...rest} to={to} className={className}>
        {children}
      </HistoryTrackerLink>
    );
  }
)(() => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
    color: 'inherit',
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
    tableLayout: 'auto',
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
