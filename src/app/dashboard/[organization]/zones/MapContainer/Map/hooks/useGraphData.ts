import { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { GraphData } from 'react-force-graph-2d';


import {
  ZonesMapDocument,
  ZonesMapQueryResult,
} from '~/app/dashboard/[organization]/zones/graphql/v2/HomePage/__generated__/ZonesMap.query.generated';
// import { useDefaultSearchParam } from '~/app/dashboard/[organization]/zones/hooks/useDefaultSearchParam';
// import { useSelectedPeriod } from '~/app/dashboard/[organization]/zones/hooks/useSelectedPeriod';
import { SortRow } from '~/app/dashboard/[organization]/zones/hooks/useSortedTableData';
import { ColumnKeys } from '~/app/dashboard/[organization]/zones/Types';

import { GraphDataApi, ZoneLinkApi, ZoneStatApi } from '../Types';

enum PeriodKeys {
  DAY = '24h',
  WEEK = '7d',
  MONTH = '30d',
}

const PERIODS_IN_HOURS_BY_KEY: Record<PeriodKeys, number> = {
  [PeriodKeys.DAY]: 24,
  [PeriodKeys.WEEK]: 24 * 7,
  [PeriodKeys.MONTH]: 24 * 30,
};


const sortingKeyByColumnKey: Record<ColumnKeys, keyof ZoneStatApi> = {
  [ColumnKeys.IbcVolume]: 'ibcVolumeRating',
  [ColumnKeys.IbcTransfers]: 'ibcTransfersRating',
  [ColumnKeys.TotalTxs]: 'totalTxsRating',
  [ColumnKeys.Dau]: 'dauRating',
};

export function useGraphData(): {
  data: GraphDataApi;
  loading: boolean;
} {
  //const [selectedPeriod] = useSelectedPeriod();

  const [graphData, setGraphData] = useState<GraphDataApi>({ nodes: [], links: [] });
  const options = {
    variables: {
      period: PERIODS_IN_HOURS_BY_KEY[PeriodKeys.DAY as PeriodKeys],
      isMainnet: true,
    },
  };

  const { data, loading } = useQuery(ZonesMapDocument, options);

  useEffect(() => {
    // prevent setting undefined graph data while loading new data (period switcher as an example)
    // it helps to show animation between layers
    if (loading) {
      return;
    }

    //const newData = transformMapData(data, sortingKeyByColumnKey[selectedColumnKey]);
    //setGraphData(newData);
  }, [data, loading]);

  return { data: graphData, loading };
}

function transformMapData(
  data: ZonesMapQueryResult | undefined,
  columnKey: keyof ZoneStatApi
): GraphDataApi {
  if (!data) {
    return { nodes: [], links: [] };
  }

  let zonesStats: ZoneStatApi[] = data.zonesStats.map((zoneStat) => ({
    ...zoneStat,
    ...zoneStat.switchedStats[0],
  }));
  const zonesGraphsData: ZoneLinkApi[] = JSON.parse(JSON.stringify(data.zonesGraphs));

  zonesStats = zonesStats.sort((a, b) => SortRow(a, b, columnKey, 'asc'));

  const nodesKeySet = new Set(zonesStats.map((node) => node.zone));

  const zonesGraphs = zonesGraphsData.filter((link) => filterLinksWithoutNodes(link, nodesKeySet));

  return {
    nodes: zonesStats,
    links: zonesGraphs,
  } as GraphDataApi;
}

function filterLinksWithoutNodes(link: ZoneLinkApi, nodesSet: Set<string>) {
  const hasSource = nodesSet.has(link.source);
  const hasTarget = nodesSet.has(link.target);

  if (!hasSource || !hasTarget) {
    return false;

    const ids =
      !hasSource && !hasTarget
        ? `${link.source}, ${link.target}`
        : !hasSource
        ? link.source
        : link.target;

    const msg = `There is no nodes (${ids}) for link ${link.source}->${link.target}`;
    console.error(msg);

    return false;
  }
  return true;
}
