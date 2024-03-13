import { useFetchSentPartnerships } from '~/lib/partnerships/hooks/use-fetch-sent-partnerships';
import Alert from '../../core/ui/Alert';


const SentPartnershipsListContainer: React.FC<{ senderId: number }> = ({ senderId }) => {
    const { data: partnerships, isLoading, error } = useFetchSentPartnerships(senderId);

    if (isLoading) {
        return <p>Loading Partnerships...</p>
    }

    if (error) {
        return (
            <Alert type='error'>
                Ops, we encountered an error!
            </Alert>
        );
    }

    return (
        <div>
            {partnerships?.map(partnership => (
                <div key={partnership.name}>
                    <p>{partnership.name}</p>
                    <p>{partnership.description}</p>
                </div>
            ))}
        </div>
    )
};

export default SentPartnershipsListContainer;