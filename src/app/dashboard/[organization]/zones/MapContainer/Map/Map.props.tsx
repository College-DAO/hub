import { RefObject } from 'react';

import { GraphDataApi } from './Types';
import { MapType } from '../MapContainer.types';
import { NodeObject } from 'react-force-graph-2d';

export interface MapProps {
  mapType: MapType;
  increaseZoom: RefObject<() => void>;
  decreaseZoom: RefObject<() => void>;
  data: GraphDataApi;
  disableZoomIn: (value: boolean) => void;
  disableZoomOut: (value: boolean) => void;
  onZoneClick: (node: NodeObject) => void;
}
