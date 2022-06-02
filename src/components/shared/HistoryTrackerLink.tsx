import { forwardRef } from "react";
import { Link, useHistory } from "react-router-dom";

interface HistoryTrackerLinkProps {
    to: string,
    children: JSX.Element | string  | number,
    className?: string
}

const HistoryTrackerLink = forwardRef<any, any>((props: HistoryTrackerLinkProps, ref) => {
    const { className, children, to, ...rest } = props;
    const history = useHistory();
    const location = history.location;

    return (
        <Link 
            ref={ref}
            className={className} 
            to={{
                pathname: to, 
                state: {
                    referrer: location.pathname + location.search
                }
            }} 
            {...rest}
        >
            {children}
        </Link>
    );
});


export default HistoryTrackerLink;