import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

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
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedActivities() {
        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            const date = activity.date;
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
        activity.date = activity.date.split('T')[0];
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

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
        this.editMode = false;
    };

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
        } catch (error) {
            console.log(error);
        }
        this.editMode = false;
        this.loading = false;
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
};