'use client';

import { Suspense, useCallback, useRef, useState } from 'react';

import cn from 'classnames';
import { motion } from 'framer-motion';
import { Sidebar } from '../Sidebar/Sidebar';
import { Icon2d, Icon3d, ZoomIn, ZoomOut } from '../assets/icons';
import { Button } from '../components/ui/Button/Button';
import { ButtonSize, ButtonVariant } from '../components/ui/Button/Button.props';
import { DefaultErrorFallback } from '../ErrorBoundary';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

import { useGraphData } from './Map/hooks/useGraphData';
import { Map } from './Map/Map';
import styles from './MapContainer.module.scss';
import { MapContainerProps } from './MapContainer.props';
import { DefaultMapType, MapType } from './MapContainer.types';
import { MapLegend } from './MapLegend';
import { nodes, links } from '../mock_data';
import nodeData from '../data.json'

export default function MapContainer({ className }: MapContainerProps) {
  
  const increaseZoom = useRef<() => void | null>(null);
  const decreaseZoom = useRef<() => void | null>(null);
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false);
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false);
  
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
          />
          <Sidebar  />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
