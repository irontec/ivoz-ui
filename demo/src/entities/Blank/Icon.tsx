import { SvgIcon } from '@mui/material';

export default function Icon(props: Record<string, unknown>): JSX.Element {
  return (
    <SvgIcon {...props}>
      <path d='M13,3 C14.0543909,3 14.9181678,3.81587733 14.9945144,4.85073759 L15,5 L15,21 L9,21 L9,5 C9,3.94563773 9.81587733,3.08183483 10.8507376,3.00548573 L11,3 L13,3 Z M20,8 C21.1046,8 22,8.89543 22,10 L22,19 C22,20.1046 21.1046,21 20,21 L17,21 L17,8 L20,8 Z M7,11 L7,21 L4,21 C2.89543,21 2,20.1046 2,19 L2,13 C2,11.8954 2.89543,11 4,11 L7,11 Z'></path>
    </SvgIcon>
  );
}
