import { Theme } from '@mui/material';
import { styled } from '@mui/styles';
import HistoryTrackerLink from '../../components/shared/HistoryTrackerLink';

const StyledDashboardLink = styled(
    (props) => {
        const { children, className, to } = props;
        return (<HistoryTrackerLink to={to} className={className}>{children}</HistoryTrackerLink>)
    }
)(
    ({ theme }: { theme: Theme }) => {
        return {
            'color': theme.palette.primary.dark,
            'text-decoration': 'none',
        }
    }
);

export default StyledDashboardLink;