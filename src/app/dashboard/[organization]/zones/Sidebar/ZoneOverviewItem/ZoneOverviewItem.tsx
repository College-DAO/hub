import cn from 'classnames';

import {SkeletonTextWrapper } from '~/app/dashboard/[organization]/zones//components/Skeleton/SkeletonTextWrapper/SkeletonTextWrapper';
import { NumberFormat } from '~/app/dashboard/[organization]/zones/components/ui/NumberFormat/NumberFormat';

import styles from './ZoneOverviewItem.module.scss';
import { ZoneOverviewItemProps } from './ZoneOverviewItem.props';

function ZoneOverviewItem({
  children,
  className,
  defaultLoadingValue,
  loading,
  numberType,
  period,
  rowDirection = false,
  title,
  tooltipText,
  value,
  ...props
}: ZoneOverviewItemProps) {
  return (
    <div
      className={cn(styles.itemContainer, className, {
        [styles.rowDirection]: rowDirection,
      })}
      {...props}
    >
      <div className={styles.title}>
        {title}
        {period && <span> ({period})</span>}
      </div>
      <div className={styles.value}>
        <SkeletonTextWrapper loading={loading} defaultText={defaultLoadingValue}>
          {children ? children : <NumberFormat value={value} numberType={numberType} />}
        </SkeletonTextWrapper>
      </div>
    </div>
  );
}

export { ZoneOverviewItem };
