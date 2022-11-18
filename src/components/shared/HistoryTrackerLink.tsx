import EntityInterface from '../../entities/EntityInterface';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EntityValues } from '../../services';
import { useStoreActions } from '../../store';

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
    const location = useLocation();

    const setParentRow = useStoreActions((actions) => {
      return actions.list.setParentRow;
    });

    const state: Record<string, string> = {
      referrer: location.pathname + location.search,
    };

    if (parentEntity && parentRow) {
      state.referrerIden = parentEntity.toStr(parentRow);
    }

    useEffect(() => {
      if (parentEntity && parentRow) {
        setParentRow(parentRow);
      }
    }, [parentRow]);

    return (
      <Link
        ref={ref}
        className={className}
        to={to}
        state={state}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

export default HistoryTrackerLink;
