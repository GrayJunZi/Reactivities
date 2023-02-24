import { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import LoadingConponent from '../../../app/layout/LoadingComponent';
import ActivityFilter from './ActivityFilter';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();

    useEffect(() => {
        if (activityStore.activityRegistry.size === 0)
            activityStore.loadActivities();
    }, [activityStore]);

    // 加载中
    if (activityStore.loadingInitial) {
        return <LoadingConponent content='Loading app' />;
    }

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilter />
            </Grid.Column>
        </Grid>
    );
});