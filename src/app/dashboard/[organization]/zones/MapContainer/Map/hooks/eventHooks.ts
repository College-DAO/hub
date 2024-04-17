import { useCallback, useState, useEffect} from 'react';

import { NodeObject } from 'react-force-graph-2d';
import { useParams } from 'react-router-dom';

//import { useNavigateWithSearchParams } from '~/app/dashboard/[organization]/zones/hooks/useNavigateWithSearchParams';
import { overviewPath } from '~/app/dashboard/[organization]/zones/routing';

import { HoveredZoneKeyType, MapNode, SelectedZoneKeyType } from '../Types';

export const useClearSelectedNode = () => {
  const { zone: selectedZoneKey = undefined } = useParams<string>();

  const [selectedZone, setSelectedZone] = useState<MapNode | null>(null);
  const onZoneClick = useCallback(
    (node: NodeObject) => {
      const zone = node as MapNode;
      setSelectedZone(zone);
    },
    []
  );

  const clearSelectedZone = useCallback(() => {
    setSelectedZone(null);
  }, []);

  useEffect(() => {
    if (!selectedZoneKey) {
      clearSelectedZone();
    }
  }, [selectedZoneKey, clearSelectedZone]);

  return clearSelectedZone;
};

export const useHoveredZone = () => {
  const [hoveredZoneKey, setHoveredZoneKey] = useState<HoveredZoneKeyType>(undefined);

  const onZoneHover = useCallback(
    (node: NodeObject | null) => {
      const zone = node as MapNode;
      setHoveredZoneKey(zone?.zone);
    },
    [setHoveredZoneKey]
  );

  return [hoveredZoneKey, onZoneHover] as const;
};

export const useSelectedZone = () => {
  const { zone: selectedZoneKey = undefined } = useParams<string>();
  const [selectedZone, setSelectedZone] = useState<MapNode | null>(null);

  const onZoneClick = useCallback(
    (node: NodeObject) => {
      const zone = node as MapNode;
      setSelectedZone(zone);
    },
    []
  );

  const clearSelectedZone = useCallback(() => {
    setSelectedZone(null);
  }, []);

  useEffect(() => {
    if (!selectedZoneKey) {
      clearSelectedZone();
    }
  }, [selectedZoneKey, clearSelectedZone]);

  return [selectedZoneKey, onZoneClick, selectedZone, clearSelectedZone] as const;
};