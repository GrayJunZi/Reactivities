import { makeAutoObservable } from "mobx";
import { format } from "date-fns";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            //const date = activity.date!.toISOString().split('T')[0];
            const date = format(activity.date!, 'yyyy-MM-dd HH:mm:ss');
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: Activity[]; }));
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            });
        } catch (error) {

        }
        this.setLoadingInitial(false);
    };

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (!activity) {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.detail(id);
                this.setActivity(activity);
            } catch (error) {
                console.log(error);
            }
        }
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
    };

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(x => x.userName === user.userName);
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(x => x.userName === activity.hostUserName);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    };

    cancelSeletedActivity = () => {
        this.selectedActivity = undefined;
    };

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSeletedActivity();
        this.editMode = true;
    };

    closeForm = () => {
        this.editMode = false;
    };

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user?.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            this.selectedActivity = newActivity;
        } catch (error) {
            console.log(error);
        }
    };

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            if (activity.id) {
                let updatedActivity = { ...this.getActivity(activity.id), ...activity };
                this.activityRegistry.set(activity.id, updatedActivity as Activity);
                this.selectedActivity = activity as Activity;
            }
        } catch (error) {
            console.log(error);
        }
    };

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            if (this.selectedActivity?.isGoing) {
                this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.userName !== user?.userName);
                this.selectedActivity.isGoing = false;
            } else {
                const attendee = new Profile(user!);
                this.selectedActivity?.attendees?.push(attendee);
                this.selectedActivity!.isGoing = true;
            }
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    };
};