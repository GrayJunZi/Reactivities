import { observer } from 'mobx-react-lite';
import { Segment, Header } from 'semantic-ui-react';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>

            </Segment>
        </>

    );
});