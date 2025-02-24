import {
  CreditCardIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  TableCellsIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

import configuration from '~/configuration';

type Divider = {
  divider: true;
};

type NavigationItemLink = {
  label: string;
  path: string;
  Icon: (props: { className: string }) => JSX.Element;
  end?: boolean;
};

type NavigationGroup = {
  label: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children: NavigationItemLink[];
};

type NavigationItem = NavigationItemLink | NavigationGroup | Divider;

type NavigationConfig = {
  items: NavigationItem[];
};

const paths = configuration.paths.settings;

const NAVIGATION_CONFIG = (organization: string): NavigationConfig => ({
  items: [
    {
      label: 'common:dashboardTabLabel',
      path: getPath(organization, ''),
      Icon: ({ className }: { className: string }) => {
        return <Squares2X2Icon className={className} />;
      },
      end: true,
    },
    {
      label: 'Partnerships',
      path: getPath(organization, '/partnerships'),
      Icon: ({ className }: { className: string }) => {
        return <TableCellsIcon className={className} />;
      },
      end: true,
    },
    {
      label: 'common:profileSettingsTabLabel',
      path: getPath(organization, paths.profile),
      Icon: ({ className }: { className: string }) => {
        return <Cog6ToothIcon className={className} />;
      },
    }
  ],
});

export default NAVIGATION_CONFIG;

function getPath(organizationId: string, path: string) {
  const appPrefix = configuration.paths.appPrefix;

  return [appPrefix, organizationId, path].filter(Boolean).join('/');
}
