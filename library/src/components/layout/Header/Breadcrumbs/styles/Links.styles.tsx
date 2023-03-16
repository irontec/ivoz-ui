import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled, Typography } from '@mui/material';
import HistoryTrackerLink from '../../../../shared/HistoryTrackerLink';

const linkStyles = {
  textDecoration: 'none',
  display: 'flex',
  color: 'black',
};

interface StyledCollapsedBreadcrumbsLinkProps {
  className?: string;
  children: string | JSX.Element;
  to: string;
}

export const StyledCollapsedBreadcrumbsLink = styled(
  (props: StyledCollapsedBreadcrumbsLinkProps) => {
    const { className, children, to, ...rest } = props;
    return (
      <HistoryTrackerLink className={className} to={to} {...rest}>
        {children}
      </HistoryTrackerLink>
    );
  }
)(() => {
  return {
    ...linkStyles,
  };
});

interface StyledCollapsedBreadcrumbsTypographyProps {
  className?: string;
  children: string | JSX.Element;
}

export const StyledCollapsedBreadcrumbsTypography = styled(
  (props: StyledCollapsedBreadcrumbsTypographyProps) => {
    const { className, children, ...rest } = props;
    return (
      <Typography className={className} {...rest}>
        {children}
      </Typography>
    );
  }
)(() => {
  return {
    ...linkStyles,
  };
});

interface StyledCollapsedBreadcrumbsNavigateNextIconProps {
  className?: string;
}
export const StyledCollapsedBreadcrumbsNavigateNextIcon = styled(
  (props: StyledCollapsedBreadcrumbsNavigateNextIconProps) => {
    const { className } = props;
    return <NavigateNextIcon fontSize='small' className={className} />;
  }
)(() => {
  return {
    ...linkStyles,
  };
});
