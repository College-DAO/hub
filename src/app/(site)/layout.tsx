import loadAuthPageData from '~/lib/server/loaders/load-auth-page-data';
import AuthPageShell from '~/app/auth/components/AuthPageShell';

async function SiteLayout({ children }: React.PropsWithChildren) {
  const { language } = await loadAuthPageData();
  return (
    <AuthPageShell language={language}>{children}</AuthPageShell>
  );
}

export default SiteLayout;
