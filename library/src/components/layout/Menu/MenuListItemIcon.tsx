import React, { LegacyRef, ReactNode } from 'react';

export const MenuListItemIcon = React.forwardRef(
  (props: { icon: ReactNode }, ref) => {
    const { icon } = props;
    return (
      <span {...props} ref={ref as LegacyRef<HTMLSpanElement>}>
        {icon}
      </span>
    );
  }
);
MenuListItemIcon.displayName = 'MenuListItemIcon';
