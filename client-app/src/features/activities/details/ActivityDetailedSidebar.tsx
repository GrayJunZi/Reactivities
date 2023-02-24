import { Segment, List } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity;
}

export default observer(function ActivityDetailedSidebar({ activity }: Props) {
    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >

            </Segment>
            <Segment attached>
                <List relaxed divided>

                </List>
            </Segment>
        </>

    );
});
