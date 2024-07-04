'use client';

import { Suspense, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { Sidebar } from '../Sidebar/Sidebar';
import { Button } from '../components/ui/Button/Button';
import { ButtonSize, ButtonVariant } from '../components/ui/Button/Button.props';
import { DefaultErrorFallback } from '../ErrorBoundary';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { useHoveredZone, useSelectedZone, useClearSelectedNode} from '~/app/dashboard/[organization]/zones//MapContainer/Map/hooks/eventHooks';
import { Map } from './Map/Map';
import styles from './MapContainer.module.scss';
import { MapContainerProps } from './MapContainer.props';
import { DefaultMapType, MapType } from './MapContainer.types';
import { MapLegend } from './MapLegend';
import { nodes, links } from '../mock_data';
import nodeData from '../data.json'
import {MapNode} from '~/app/dashboard/[organization]/zones//MapContainer/Map/Types';
import { NodeObject } from 'react-force-graph-2d';
import { AnimatePresence } from 'framer-motion';

export default function MapContainer({ className }: MapContainerProps) {
  
  const increaseZoom = useRef<() => void | null>(null);
  const decreaseZoom = useRef<() => void | null>(null);
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false);
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false);  
  const [currentZone, setSelectedZone] = useState<MapNode | null>(null);
  const [selectedZoneKey, onZoneClick, selectedZone, clearSelectedZone] = useSelectedZone();
  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };
  const handleCloseSidebar = useCallback(() => {
    clearSelectedZone();
    console.log('Closing sidebar');
    // This function will be passed to Sidebar to close it
  }, [clearSelectedZone]);
  const handleZoneClick = useCallback((node: NodeObject) => {
    const zone = node as MapNode;
    onZoneClick(node);
  }, [onZoneClick]);

  const onZoomIn = useCallback(() => {
    if (!isZoomInDisabled) {
      increaseZoom?.current && increaseZoom.current();
    }
  }, [isZoomInDisabled]);

  const onZoomOut = useCallback(() => {
    if (!isZoomOutDisabled) {
      decreaseZoom?.current && decreaseZoom.current();
    }
  }, [isZoomOutDisabled]);

  return (
    <div className={cn(styles.container, className)}>

      <ErrorBoundary fallback={<DefaultErrorFallback />}>
        <Suspense>
          <Map
            data={nodeData}
            mapType={'2d'}
            increaseZoom={increaseZoom}
            decreaseZoom={decreaseZoom}
            disableZoomIn={(value: boolean) => setIsZoomInDisabled(value)}
            disableZoomOut={(value: boolean) => setIsZoomOutDisabled(value)}
            onZoneClick={handleZoneClick}
          />
          <AnimatePresence>
          {selectedZone && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              className={styles.sidebarAnimationContainer}
            >
              <Sidebar selectedZone={selectedZone} onClose={handleCloseSidebar} />
             </motion.div>
            )}
          </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  </div>
  );
}
