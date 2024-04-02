'use client'

import AppHeader from '../components/AppHeader';
import { withI18n } from '~/i18n/with-i18n';
import Spinner from '~/core/ui/Spinner';
import Trans from '~/core/ui/Trans';
import { PageBody } from '~/core/ui/Page';
import { Outlet} from 'react-router-dom';
import dynamic from 'next/dynamic';
import { useShowMap } from './hooks/useShowMap';
import styles from './HomePage.module.scss';
import MapContainer from './MapContainer/MapContainer';
import { useRouter } from 'next/router';
import { router } from './_router';

const MapContainerDynamic = dynamic(() => import('./MapContainer/MapContainer'), { ssr: false });

function ZonesPage() {
  const showMap = useShowMap();
  return (
    <>
      <PageBody>
      <div className={styles.pageContainer} style={{ background: `url('/assets/images/stars-bg.svg') center/cover` }}>
          {showMap && <MapContainerDynamic className={styles.map} />}
          <Outlet />
        </div>
      </PageBody>
    </>
  );
}

export default ZonesPage;
