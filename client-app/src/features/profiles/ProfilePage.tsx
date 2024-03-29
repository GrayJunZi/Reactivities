import { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";
import LoadingConponent from '../../app/layout/LoadingComponent';

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string; }>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile, setActivityTab } = profileStore;

    useEffect(() => {
        loadProfile(username!);
        return () => {
            setActivityTab(0);
        };
    }, [loadProfile, username, setActivityTab]);

    if (loadingProfile)
        return <LoadingConponent content='Loading profile...' />;

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }
            </Grid.Column>
        </Grid>
    );
});