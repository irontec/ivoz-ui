import { styled } from '@mui/material';

export const StyledTableSortLabelVisuallyHidden = styled('span')(
    () => {
        return {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        }
    }
);
