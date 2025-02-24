import { Outlet } from 'react-router-dom';
import { Card } from '../components/ui/Card/Card';
import { ButtonGroup } from '../components/ui/ButtonGroup/ButtonGroup';
import { ExternalLink } from '../components/ui/ExternalLink/ExternalLink';
import { ZoneLogo } from '../components/ui/ZoneLogo/ZoneLogo';
import { SkeletonTextWrapper } from '../components/Skeleton/SkeletonTextWrapper/SkeletonTextWrapper';
import styles from './Sidebar.module.scss';
import contentStyle from './ZoneDetails.module.scss';
import { NumberFormat } from '../components/ui/NumberFormat';
import { ScrollableContainer } from '../components/ui/ScrollableContainer/ScrollableContainer';
import { NumberType } from '../components/ui/NumberFormat';
import { ZoneOverviewItem } from './ZoneOverviewItem/ZoneOverviewItem';
import {MapNode} from '~/app/dashboard/[organization]/zones//MapContainer/Map/Types';
import classNames from 'classnames';
import { motion } from 'framer-motion';

interface SidebarProps {
  selectedZone: MapNode | null;
  onClose: () => void;
}
function Sidebar({ selectedZone, onClose }: SidebarProps) {
  const data = selectedZone
    ? {
        website: selectedZone.website,
        zone: selectedZone.zone,
        logoUrl: selectedZone.logoUrl,
        name: selectedZone.name,
      }
    : {
        website: '',
        zone: '',
        logoUrl: '',
        name: '',
      };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
      }}
      className={`${contentStyle.container} ${classNames}`}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' , zIndex: '1000'}}>
        &times;
      </button>
    <Card className={`${contentStyle.container} ${classNames}`}>
        <div className={contentStyle.detailsTitle}>
          <ZoneLogo
            logoUrl={data.logoUrl}
            name={data.name}
            size="60px"
            className={contentStyle.zoneLogo}
            withOuterShadow={true}
          />
          <div className={contentStyle.zoneBaseInfo}>
            <SkeletonTextWrapper
              defaultText="cosmos"
              className={contentStyle.zoneName}
            >
              {data.name}
            </SkeletonTextWrapper>
            <SkeletonTextWrapper
              defaultText="httpss://cosmos.network"
              className={contentStyle.zoneWebsite}
            >
              {data.website && (
                <ExternalLink
                  href={data.website}
                >
                  {data.website}
                </ExternalLink>
              )}
            </SkeletonTextWrapper>
          </div>
        </div>
        <ButtonGroup className={contentStyle.pagesSwitcher}>
        </ButtonGroup>
        <div className={styles.detailedInfo}>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Bio'}
            defaultLoadingValue={""}
            //value={156}
          ></ZoneOverviewItem>

          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Member Count'}
            defaultLoadingValue={'12345'}
            //value = {100}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Expertise'}
            defaultLoadingValue={'DeFi, Consulting'}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Location'}
            defaultLoadingValue={'USA'}
          ></ZoneOverviewItem>
          {/* <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={"dauTitle"}
            value={0}
          ></ZoneOverviewItem> */}
          {/* <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={`IBC`}
          >
            <NumberFormat value={0} />
            <span className={styles.additionalInfo}>
              {' '}
              (<NumberFormat value={0} numberType={NumberType.Percent} />
              {` of ${0}`})
            </span>
          </ZoneOverviewItem> */}
          {/* <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Token Price'}
            defaultLoadingValue={'$10.45'}
          >
            <NumberFormat value={0} numberType={NumberType.Currency} />
            <span className={styles.additionalInfo}> {0}</span>
          </ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Market Cap'}
            defaultLoadingValue={'$123,456,789'}
          ></ZoneOverviewItem> */}
        </div>
      </Card>
      </motion.div>
  );
}

export { Sidebar };
