import { CardContent, styled } from '@mui/material';

interface ContentCardProps {
  children: React.ReactNode;
}

const StyledCardContent = (props: ContentCardProps): JSX.Element => {
  const { children, ...rest } = props;

  return <CardContent {...rest}>{children}</CardContent>;
};

export default styled(StyledCardContent)(() => {
  return {
    border: '1px solid red',
  };
});
