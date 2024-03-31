// import { useCallback } from 'react';

// import { useSearchParams, useLocation } from 'react-router-dom';

// import { MapType, DefaultMapType } from '~/app/dashboard/[organization]/zones/MapContainer/MapContainer.types';
// import { ColumnKeys } from '~/app/dashboard/[organization]/zones/Types';

// import { HOME_PAGE_TABLE_COLUMN_TITLE } from './useViewedHomePageAnalytics';
// import { trackEvent } from '~/app/dashboard/[organization]/zones/hooks/analytics/useAnalytics';

// export enum SelectedZoneSourceView {
//   Sidebar = 'sidebar view',
//   Map = 'map view',
// }

// export function useHomePageSelectedZoneAnalytics(): (selectedZone: string | undefined) => void {

//   const period = searchParams.get('period');
//   const columnKey = searchParams.get('columnKey') as ColumnKeys;
//   const searchZone = searchParams.get('searchZone');
//   const mapType = (searchParams.get('mapType') as MapType) ?? DefaultMapType;

//   const trackSelectedZone = useCallback(
//     (selectedZone: string | undefined) => {
//       trackEvent('selected zone', {
//         period,
//         zone: selectedZone,
//         param: columnKey ? HOME_PAGE_TABLE_COLUMN_TITLE[columnKey] : '',
//         source: location.state?.source,
//         searchZone,
//         mapType,
//       });
//     },
//     [columnKey, location.state?.source, mapType, period, searchZone]
//   );

//   return trackSelectedZone;
// }
