import { memo, useEffect } from 'react';

import cn from 'classnames';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { SelectedZoneOverviewSource } from '~/app/dashboard/[organization]/zones/hooks/analytics/ZonePage/ZoneOverviewPage/useViewedZoneOverviewPageAnalytics';
import { useNavigateWithSearchParams } from '~/app/dashboard/[organization]/zones/hooks/useNavigateWithSearchParams';
import { getZonesOverviewPath } from '~/app/dashboard/[organization]/zones/routing';

import styles from './SeeDetailsPopupButton.module.scss';
import { SeeDetailsPopupButtonProps } from './SeeDetailsPopupButton.props';

const BTN_INITIAL_OFFSET = 10;

export const MemoizedSeeDetailsPopupButton = memo(SeeDetailsPopupButton);

export function SeeDetailsPopupButton({
  x,
  y,
  selectedZoneKey,
  zoomValue,
}: SeeDetailsPopupButtonProps) {
  const animationControls = useAnimation();

  useEffect(() => {
    if (selectedZoneKey) {
      animationControls.set({ opacity: 0, top: y + BTN_INITIAL_OFFSET * zoomValue });
      animationControls.start({
        opacity: 1,
        top: y,
        transition: {
          duration: 0.3,
          delay: 1,
        },
      });
    }
  }, [zoomValue, selectedZoneKey, animationControls, y]);

  const navigateWithSearchParams = useNavigateWithSearchParams();

  const onZoneInfoRowClick = (zoneKey: string) => {
    navigateWithSearchParams(`/${getZonesOverviewPath(zoneKey)}`, {
      state: { source: SelectedZoneOverviewSource.Map },
    });
  };

  return (
    <motion.div
      className={styles.seeDetailsBtn}
      animate={animationControls}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        opacity: 0,
        fontSize: `${14 * zoomValue}px`,
        padding: `${4 * zoomValue}px ${8 * zoomValue}px`,
      }}
      onClick={() => onZoneInfoRowClick(selectedZoneKey)}
    >
      <div
        className={cn(styles.triangle, styles.bottom)}
        style={{
          borderWidth: `${8 * zoomValue}px`,
        }}
      />
      <span className={styles.btnContent}>
        See Details
        <ArrowRightIcon
          className={styles.arrowIcon}
          style={{
            width: `${6 * zoomValue}px`,
            height: `${10 * zoomValue}px`,
            marginLeft: `${6 * zoomValue}px`,
          }}
        />
      </span>
    </motion.div>
  );
}
