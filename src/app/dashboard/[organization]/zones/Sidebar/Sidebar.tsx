import { Outlet } from 'react-router-dom';
import { Card } from '../components/ui/Card/Card';
import { CloseCircleIcon, EarthIcon } from '../assets/icons';
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

interface SidebarProps {
  selectedZone: MapNode | null;
}
function Sidebar({ selectedZone }: SidebarProps) {
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
    <Card className={contentStyle.container}>
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
                  Icon={EarthIcon}
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
            title={'IBC Transfers'}
            defaultLoadingValue={'72 235'}
            //value = {100}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Peers'}
            defaultLoadingValue={'12'}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Channels'}
            defaultLoadingValue={'250'}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={"dauTitle"}
            value={0}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={`IBC`}
          >
            <NumberFormat value={0} />
            <span className={styles.additionalInfo}>
              {' '}
              (<NumberFormat value={0} numberType={NumberType.Percent} />
              {` of ${0}`})
            </span>
          </ZoneOverviewItem>
          <ZoneOverviewItem
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
          ></ZoneOverviewItem>
        </div>
      </Card>
  );
}

export { Sidebar };
