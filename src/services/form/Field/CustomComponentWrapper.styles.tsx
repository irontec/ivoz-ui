
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material';

export const StyledCloseIcon = styled(CloseIcon)(
    () => {
        return {
            position: 'relative',
        }
    }
);

interface StyledFieldsetRootProps {
    children: React.ReactNode,
    label: string | React.ReactElement<any>,
    hasChanged: boolean,
    disabled: boolean,
    className?: string,
}
export const StyledFieldsetRoot = styled(
    (props: StyledFieldsetRootProps) => {
        const { children, label, hasChanged, disabled } = props;

        let className = props.className;
        if (hasChanged) {
            className += ' changed';
        }
        if (disabled) {
            className += ' disabled';
        }

        return (
            <div className={className}>
                <label>{label}</label>
                <div className='fieldsetContainer'>
                    {children}
                </div>
            </div>
        );
    }
)(
    ({ theme }) => {
        return {
            display: 'inline-flex',
            flexDirection: 'column',
            position: 'relative',
            // Reset fieldset default style.
            minWidth: 0,
            padding: 0,
            margin: '0 0 8px 0',
            border: 0,
            verticalAlign: 'top', // Fix alignment issue on Safari.
            width: '100%',
            borderRadius: '4px',
            '& > label': {
                transform: 'translate(21px, -9px) scale(0.75)',
                transformOrigin: 'top left',
                color: theme.palette.text.secondary,
                fontSize: '1rem',
                zIndex: 1,
                pointerEvents: 'none',
                top: 0,
                left: 0,
                position: 'absolute',
            },
            '&.changed > label': {
                color: theme.palette.info.main,
            },
            '& > div.fieldsetContainer': {
                position: 'relative',
                top: '-5px',
            },
            '&.disabled fieldset div.customComponentContainer': {
                color: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }
);

interface StyledFieldsetProps {
    children: React.ReactNode
    className?: string, 
    label: string | React.ReactElement<any>,
}
export const StyledFieldset = styled(
    (props: StyledFieldsetProps) => {
        const { children, className, label } = props;
        return (
            <fieldset className={className}>
                <legend>
                    <span>{label}</span>
                </legend>
                <div className='customComponentContainer'>
                    {children}
                </div>
            </fieldset>
        );
    }
)(
    ({ theme }) => {

        const borderColor = theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.23)'
            : 'rgba(255, 255, 255, 0.23)';

        return {
            position: 'relative',
            top: '-5px',
            borderWidth: '1px',
            borderRadius: theme.shape.borderRadius,
            borderColor: borderColor,
            '& > legend': {
                visibility: 'hidden',
                fontSize: '0.8rem',
            },
            '& .customComponentContainer': {
                fontSize: '1rem',
                color: theme.palette.text.secondary,
                padding: '0px 0 7px',
            }
        };
    }
);