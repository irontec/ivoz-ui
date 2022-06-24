import { styled } from '@mui/material';
import ContentFilterSelector from './ContentFilterSelector';

const StyledContentFilterSelector = styled(ContentFilterSelector)(
    () => {
        return {
            maxWidth: '450px',
            padding: '15px 20px 10px'
        }
    }
);

export default StyledContentFilterSelector;