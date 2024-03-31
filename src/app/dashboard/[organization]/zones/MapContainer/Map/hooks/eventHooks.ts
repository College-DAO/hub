import { useCallback, useState } from 'react';

import { NodeObject } from 'react-force-graph-2d';
import { useParams } from 'react-router-dom';

// import { useNavigateWithSearchParams } from '~/app/dashboard/[organization]/zones/hooks/useNavigateWithSearchParams';
import { overviewPath } from '~/app/dashboard/[organization]/zones/routing';

import { HoveredZoneKeyType, MapNode, SelectedZoneKeyType } from '../Types';

export const useClearSelectedNode = (selectedZoneKey: SelectedZoneKeyType) => {
  // const navigateWithSearchParams = useNavigateWithSearchParams();

  return useCallback(() => {
    if (selectedZoneKey) {
      // navigateWithSearchParams('');
    }
  }, [selectedZoneKey]);
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

  // const navigateWithSearchParams = useNavigateWithSearchParams();
  // const trackSelectedZone = useHomePageSelectedZoneAnalytics();

  const onZoneClick = useCallback(
    (node: NodeObject) => {
      const zone = node as MapNode;
      // navigateWithSearchParams(`${zone.zone}/${overviewPath}`, {
      //   state: { source: SelectedZoneSourceView.Map },
      // });
      // trackSelectedZone(zone.zone);
    },
    []
  );

  return [selectedZoneKey, onZoneClick] as const;
};
