import SentPartnershipsListContainer from '~/components/partnerships/SentPartnershipsListContainer';
import ReceivedPartnershipsListContainer from '~/components/partnerships/ReceivedPartnershipsListContainer';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const PartnershipsPage: React.FC = () => {
    const organization = useCurrentOrganization();
    if (!organization || organization.id === undefined) {
        return <div>Loading or organization not found...</div>;
    }

    return (
        <SentPartnershipsListContainer senderId={organization.id} />
    );
};

export default PartnershipsPage;
