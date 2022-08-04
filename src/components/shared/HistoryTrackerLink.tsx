import EntityInterface from '../../entities/EntityInterface';
import { forwardRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { EntityValues } from '../../services';

export interface HistoryTrackerLinkProps {
  to: string;
  children: JSX.Element | string | number;
  className?: string;
  parentEntity?: EntityInterface;
  parentRow?: EntityValues;
}

const HistoryTrackerLink = forwardRef<any, any>(
  (props: HistoryTrackerLinkProps, ref) => {
    const { className, children, to, parentEntity, parentRow, ...rest } = props;
    const history = useHistory();
    const location = history.location;

    const state: Record<string, string> = {
      referrer: location.pathname + location.search,
    };

    if (parentEntity && parentRow) {
      state.referrerIden = parentEntity.toStr(parentRow);
    }

    return (
      <Link
        ref={ref}
        className={className}
        to={{
          pathname: to,
          state,
        }}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

export default HistoryTrackerLink;
