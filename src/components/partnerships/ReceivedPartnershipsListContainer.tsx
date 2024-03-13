import { useFetchReceivedPartnerships } from '~/lib/partnerships/hooks/use-fetch-received-partnerships';
import Alert from '../../core/ui/Alert';


const ReceivedPartnershipsListContainer: React.FC<{ receiverId: number }> = ({ receiverId }) => {
    const { data: partnerships, isLoading, error } = useFetchReceivedPartnerships(receiverId);

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

export default ReceivedPartnershipsListContainer;