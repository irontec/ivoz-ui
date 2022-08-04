import { TableCell, TableCellProps, Theme } from '@mui/material';
import { styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { forwardRef } from 'react';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../../../components/shared/HistoryTrackerLink';

const linkSharedStyles = {
  cursor: 'pointer',
  color: 'black',
};

const TableRowLink = forwardRef<any, any>((props, ref) => {
  const { children, className, to, ...rest } = props;
  return (
    <HistoryTrackerLink {...rest} to={to} className={className} ref={ref}>
      {children}
    </HistoryTrackerLink>
  );
});
TableRowLink.displayName = 'TableRowLink';

export const StyledTableRowCta = styled(TableRowLink)(() => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
    '& > *': {
      marginRight: '5px',
    },
  };
});

export const StyledTableRowCustomCta = styled('a')(() => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
    '& > *': {
      marginRight: '5px',
    },
  };
});

export const StyledTableRowEntityCta = styled(TableRowLink)(({ theme }) => {
  return {
    ...linkSharedStyles,
    textDecoration: 'none',
    color: theme.palette.primary.dark,
    '& > *': {
      marginLeft: '5px',
    },
  };
});

export const StyledTableRowFkLink = styled((props: HistoryTrackerLinkProps) => {
  const { children, className, to } = props;
  return (
    <HistoryTrackerLink to={to} className={className}>
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
