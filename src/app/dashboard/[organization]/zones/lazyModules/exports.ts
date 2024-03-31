import lazyPreload from './lazyPreload';

export const LazyMap2d = lazyPreload(
  () => import('~/app/dashboard/[organization]/zones/MapContainer/Map/Map2d/Map2d')
);



