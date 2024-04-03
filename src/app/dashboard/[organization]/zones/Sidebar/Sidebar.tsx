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
const data = {
  website: "https://cosmos.network",
  zone: "Cosmos Hub",
  logoUrl: "path/to/cosmos-logo.png",
  name: "Cosmos Hub",
};

function Sidebar() {
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
              defaultText="Cosmos hub"
              className={contentStyle.zoneName}
            >
              {data.name}
            </SkeletonTextWrapper>
            <SkeletonTextWrapper
              defaultText="https://cosmos.network"
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
        <ScrollableContainer className={styles.container}>
        <IbcVolumeCard />
        <div className={styles.detailedInfo}>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Total Txs'}
            period={period}
            value={data?.totalTxs}
            loading={loading}
            defaultLoadingValue={'1 156 288'}
            tooltipText={tooltips['totalTxs']()}
          ></ZoneOverviewItem>

          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'IBC Transfers'}
            period={period}
            value={data?.ibcTransfers}
            loading={loading}
            defaultLoadingValue={'72 235'}
            tooltipText={tooltips['ibcTransfers']()}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Peers'}
            value={data?.peersCount}
            loading={loading}
            defaultLoadingValue={'12'}
            tooltipText={tooltips['peersCount']()}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Channels'}
            value={data?.channelsCount}
            loading={loading}
            defaultLoadingValue={'250'}
            tooltipText={tooltips['channelsCount']()}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={dauTitle}
            loading={loading}
            value={data?.dau}
            tooltipText={tooltips['dau'](period)}
          ></ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={`IBC ${dauTitle}`}
            loading={loading}
            defaultLoadingValue={`2 345 (99,8% of ${dauTitle})`}
            tooltipText={tooltips['ibcDau'](period)}
          >
            <NumberFormat value={data?.ibcDau} />
            <span className={styles.additionalInfo}>
              {' '}
              (<NumberFormat value={data?.ibcDauPercent} numberType={NumberType.Percent} />
              {` of ${dauTitle}`})
            </span>
          </ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Token Price'}
            loading={loading}
            defaultLoadingValue={'$10.45'}
          >
            <NumberFormat value={data?.price} numberType={NumberType.Currency} />
            <span className={styles.additionalInfo}> {data?.tokenSymbol}</span>
          </ZoneOverviewItem>
          <ZoneOverviewItem
            className={styles.detailedInfoItem}
            title={'Market Cap'}
            value={data?.marketCap}
            loading={loading}
            defaultLoadingValue={'$123,456,789'}
            tooltipText={tooltips['marketCap']()}
          ></ZoneOverviewItem>
        </div>
      </ScrollableContainer>

      <ShowDetailsButton title="See Zone Details" primary onClick={onDetailedBtnClick} />
    </>
    </Card>
  );
}

export { Sidebar };
