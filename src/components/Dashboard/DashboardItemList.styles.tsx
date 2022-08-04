import { Theme } from '@mui/material';
import { styled } from '@mui/material';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../components/shared/HistoryTrackerLink';

const StyledDashboardLink = styled((props: HistoryTrackerLinkProps) => {
  const { children, className, to } = props;
  return (
    <HistoryTrackerLink to={to} className={className}>
      {children}
    </HistoryTrackerLink>
  );
})(({ theme }) => {
  return {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
  };
});

export default StyledDashboardLink;
