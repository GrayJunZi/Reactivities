import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../models/activity";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityDashboard({
    activities, selectedActivity, selectActivity, cancelSelectActivity,
    editMode, openForm, closeForm, createOrEdit, deleteActivity, submitting
}: Props) {


    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                    !editMode &&
                    selectedActivity &&
                    <ActivityDetail
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {
                    editMode &&
                    <ActivityForm
                        closeForm={closeForm}
                        activity={selectedActivity}
                        createOrEdit={createOrEdit}
                        submitting={submitting}
                    />
                }
            </Grid.Column>
        </Grid>
    );
}