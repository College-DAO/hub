import { useEffect } from 'react';

import { matchPath, useLocation, useSearchParams } from 'react-router-dom';

import { useShowMap } from '~/app/dashboard/[organization]/zones/hooks/useShowMap';
import { LazyMap2d} from '~/app/dashboard/[organization]/zones/lazyModules';
import * as path from '~/app/dashboard/[organization]/zones/routing';

export default function usePreloadModules() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const showMap = useShowMap();

  useEffect(() => {
    async function prelaod() {
      const modulesOrder = getModulesOrder(pathname, searchParams.get('mapType') === '3d', showMap);
      modulesOrder.forEach(async (component: any) => {
        if (!component?.preload) {
          return;
        }
        await component.preload();
      });
    }

    prelaod();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);
}

function getModulesOrder(pathname: string, has3dSearchParam: boolean, showMap: boolean) {
  const modulesOrder = ["hello"]; // always need to preload this module
  if (!showMap) return modulesOrder;

  const mapOrder = has3dSearchParam ? [ LazyMap2d] : [LazyMap2d];
  if (matchPath(path.swapPath, pathname)) {
    return [...modulesOrder, ...mapOrder];
  }

  return [...mapOrder, ...modulesOrder];
}
