import { SxProps, Theme } from '@mui/material';
import { StyledDialogContentBody } from './DialogContentBody.styles';

interface DialogContentProps {
  child: JSX.Element;
  sx?: SxProps<Theme>;
}
const DialogContentBody = (props: DialogContentProps) => {
  const { child, sx } = props;
  return (
    <StyledDialogContentBody sx={{ ...sx }}>{child}</StyledDialogContentBody>
  );
};

export default DialogContentBody;
