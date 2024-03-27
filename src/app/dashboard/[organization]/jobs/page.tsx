import AppHeader from '../components/AppHeader';
import { withI18n } from '~/i18n/with-i18n';
import Spinner from '~/core/ui/Spinner';
import Trans from '~/core/ui/Trans';
import { PageBody } from '~/core/ui/Page';

export const metadata = {
  title: 'Jobs',
};

function PartnershipsPage() {
  
  return (
    <>
      <AppHeader
        title={<Trans i18nKey={'Jobs'} />}
        description={<Trans i18nKey={'Get a job in the CollegeDAO ecosystem'} />}
      >
      </AppHeader>
      <PageBody>
        <Spinner></Spinner>
      </PageBody>
    </>
  );
}

export default withI18n(PartnershipsPage);
